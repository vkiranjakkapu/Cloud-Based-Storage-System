package com.cbss.storage.services.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cbss.storage.dto.FileUpdateRequestDto;
import com.cbss.storage.dto.UploadRequest;
import com.cbss.storage.enums.SecurityExceptions;
import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.models.Folder;
import com.cbss.storage.models.MetaFile;
import com.cbss.storage.repositories.MetaFileRepository;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.FolderService;
import com.cbss.storage.services.MetaFileService;
import com.cbss.storage.services.StorageService;

@Service
public class MetaFileServiceImp implements MetaFileService {

    private MetaFileRepository fileRepository;
    private CurrentUserService currentUser;
    private FolderService folderService;
    private StorageService storageService;

    public MetaFileServiceImp(
            MetaFileRepository fileRepository,
            CurrentUserService currentUser,
            FolderService folderService,
            StorageService storageService) {
        this.fileRepository = fileRepository;
        this.currentUser = currentUser;
        this.folderService = folderService;
        this.storageService = storageService;
    }

    @Override
    public MetaFile getFileById(UUID fileId) {
        MetaFile file = fileRepository.findById(fileId).orElseThrow(() -> {
            throw new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND, "File given Id not found");
        });
        if (file.isDeleted())
            throw new BusinessException(StorageExceptions.DELETED_RESOURCE_ACCESS);

        return file;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MetaFile> getFileVersions(UUID fileId) {
        MetaFile file = getFileById(fileId);
        return fileRepository.findAllByFilePathAndIsDeletedFalse(file.getFilePath()).stream()
                .sorted(Comparator.comparing(MetaFile::getCreatedAt).reversed()).toList();
    }

    @Override
    @Transactional
    public MetaFile createFile(UploadRequest request) {

        Folder parent = Optional.ofNullable(request.folderId())
                .map(folderId -> folderService.getFolderById(folderId))
                .orElseGet(() -> folderService.getOrCreateRootFolder());

        MetaFile file = new MetaFile();
        file.setOwnerId(currentUser.userId());
        file.setFolder(parent);
        file.setMimeType(request.file().getContentType());
        file.setFileSize(request.file().getSize());

        String originalName = resolveOriginalName(request.file().getOriginalFilename(), request.file());
        file.setFileName(originalName);

        Path filePath = storeDocument(request.file(), originalName, parent);
        file.setFilePath(filePath.toString());

        MetaFile prev = getFileByFilePath(filePath.toString());
        if (prev != null) {
            prev.setLatest(false);
            fileRepository.save(prev);
        }

        return fileRepository.save(file);
    }

    private String resolveOriginalName(String originalName, MultipartFile file) {
        if (StringUtils.hasText(originalName)) {
            return originalName;
        }
        if (file != null && StringUtils.hasText(file.getOriginalFilename())) {
            return file.getOriginalFilename();
        }
        return currentUser.userId().toString();
    }

    public Path storeDocument(MultipartFile file, String originalName, Folder folder) {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(originalName));

        try {
            if (fileName.contains("..")) {
                throw new BusinessException(StorageExceptions.ILLEGAL_ARGUMENTS,
                        "Filename contains invalid path sequence: " + fileName);
            }

            Path userDir = storageService.getMyRootDirectory();

            Path targetDirectory = folder == null ? userDir
                    : userDir.resolve(storageService.getPathForFolder(folder.getId()));

            if (!Files.exists(targetDirectory))
                Files.createDirectories(targetDirectory);

            Path destinationFilePath = targetDirectory.resolve(fileName);

            Files.copy(file.getInputStream(), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

            return destinationFilePath;
        } catch (IOException e) {
            throw new BusinessException(StorageExceptions.STORAGE_FAILED, "Failed to store file " + fileName, e);
        }
    }

    public MetaFile getFileByFilePath(String filePath) {
        return fileRepository.findByFilePathAndIsDeletedFalseAndIsLatestTrue(filePath).orElse(null);
    }

    public MetaFile updateFile(FileUpdateRequestDto request) {
        MetaFile file = fileRepository.findById(request.id())
                .orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
                        "File with given ID not found!"));

        switch (request.type()) {

            case MOVE:
                if (file.getFolder().getId().equals(request.targetId())) {
                    throw new BusinessException(StorageExceptions.MOVEMENT_NOT_ALLOWED,
                            "You are trying to move the file to existing folder");
                }

                Folder targetFolder = folderService.getFolderById(request.targetId());
                targetFolder.getFiles().add(file);
                file.setFolder(targetFolder);
                return fileRepository.save(file);

            default:
                return renameFile(request.id(), request.name());
        }
    }

    @Transactional
    @Override
    public MetaFile renameFile(UUID fileId, String newName) {

        MetaFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new BusinessException(
                        StorageExceptions.RESOURCE_NOT_FOUND,
                        "File with given ID not found!"));

        if (!currentUser.userId().equals(file.getOwnerId())) {
            throw new BusinessException(
                    SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to rename this file!");
        }

        String fileName = StringUtils.cleanPath(
                Objects.requireNonNull(newName));

        if (!StringUtils.hasText(fileName)
                || fileName.equals(".")
                || fileName.equals("..")
                || fileName.contains("/")
                || fileName.contains("\\")
                || Paths.get(fileName).isAbsolute()) {

            throw new BusinessException(
                    StorageExceptions.ILLEGAL_ARGUMENTS,
                    "Invalid filename: " + newName);
        }

        Path oldPath = Path.of(file.getFilePath());
        Path newPath = oldPath.resolveSibling(fileName);

        if (!Files.exists(oldPath)) {
            throw new BusinessException(
                    StorageExceptions.STORAGE_FAILED,
                    "Physical file does not exist: " + oldPath);
        }

        if (Files.exists(newPath)) {
            throw new BusinessException(
                    StorageExceptions.ILLEGAL_ARGUMENTS,
                    "A file with this name already exists!");
        }

        try {
            Files.move(oldPath, newPath);

            try {
                file.setFileName(fileName);
                file.setFilePath(newPath.toString());

                return fileRepository.save(file);

            } catch (RuntimeException e) {
                try {
                    Files.move(newPath, oldPath);
                } catch (IOException rollbackException) {
                    e.addSuppressed(rollbackException);
                }

                throw e;
            }

        } catch (IOException e) {
            throw new BusinessException(
                    StorageExceptions.STORAGE_FAILED,
                    "Failed to rename file " + fileName,
                    e);
        }
    }

    @Transactional
    @Override
    public boolean deleteFile(UUID fileId) {
        MetaFile file = getFileById(fileId);
        file.setDeleted(true);
        fileRepository.save(file);
        return true;
    }

}
