package com.cbss.storage.services.imp;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cbss.storage.dto.UploadRequest;
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
    @Transactional
    public MetaFile createFile(UploadRequest request) {

        Folder parent = Optional.ofNullable(request.folderId())
                .map(folderId -> folderService.getFolderById(folderId))
                .orElseGet(() -> folderService.getOrCreateRootFolder());

        MetaFile file = new MetaFile();
        file.setOwnerId(currentUser.userId());
        file.setFolder(parent);
        file.setMimeType(request.file().getContentType());

        String originalName = resolveOriginalName(request.file().getOriginalFilename(), request.file());
        file.setFileName(originalName);

        Path filePath = storeDocument(request.file(), originalName, parent);
        file.setFilePath(filePath.toString());

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

}
