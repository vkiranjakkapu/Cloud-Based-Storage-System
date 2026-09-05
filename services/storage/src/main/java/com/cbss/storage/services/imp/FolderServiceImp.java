package com.cbss.storage.services.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cbss.storage.dto.CreateFolderRequestDto;
import com.cbss.storage.dto.DirectoryResponseDto;
import com.cbss.storage.dto.FolderUpdateRequestDto;
import com.cbss.storage.dto.TreeResponseDto;
import com.cbss.storage.enums.SecurityExceptions;
import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.models.Folder;
import com.cbss.storage.repositories.FolderRepository;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.FolderService;
import com.cbss.storage.services.StorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderServiceImp implements FolderService {

    private final FolderRepository folderRepository;
    private final CurrentUserService currentUser;
    private final StorageService storageService;

    @Override
    @Transactional
    public Folder getFolderById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
                        "Folder with given ID not found!"));
    }

    @Override
    public TreeResponseDto getTree() {
        return mapTree(getMyRootDirectory());
    }

    private TreeResponseDto mapTree(Folder folder) {

        Set<TreeResponseDto> children = folder.getChildren()
                .stream()
                .map(this::mapTree)
                .collect(Collectors.toSet());

        return TreeResponseDto.builder()
                .parent(folder)
                .children(children)
                .build();
    }

    @Override
    @Transactional
    public DirectoryResponseDto getDirectory(Folder folder) {
        Folder current = folderRepository.findByIdWithParent(folder.getId())
                .orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND, "Folder not found"));

        if (currentUser.isUser() && !folder.getOwnerId().equals(currentUser.userId())) {
            throw new BusinessException(SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to access this folder");
        }

        List<Folder> parentFolders = new ArrayList<>();

        while (current != null) {
            parentFolders.add(0, current);
            current = current.getParent();
        }

        return DirectoryResponseDto.builder()
                .current(folder)
                .parentFolders(parentFolders)
                .subFolders(folder.getChildren().stream().filter(fld -> !fld.isDeleted()).collect(Collectors.toSet()))
                .files(folder.getFiles().stream().filter(file -> !file.isDeleted() && file.isLatest())
                        .collect(Collectors.toSet()))
                .build();
    }

    @Override
    @Transactional
    public Folder getMyRootDirectory() {
        return folderRepository.findByOwnerIdAndIsRootTrue(currentUser.userId()).orElse(null);
    }

    @Override
    @Transactional
    public Folder getOrCreateRootFolder() {

        UUID userId = currentUser.userId();

        Folder root = folderRepository
                .findByOwnerIdAndIsRootTrue(userId)
                .orElse(null);

        if (root != null) {
            return root;
        }

        return createRootDirectory(currentUser.userId(), currentUser.email());
    }

    @Override
    @Transactional
    public Folder createRootDirectory(UUID userId, String email) {

        Folder newRoot = new Folder();
        newRoot.setOwnerId(userId);

        String userFolder = email.split("@")[0].replace(".", "");
        newRoot.setName(userFolder);
        newRoot.setRoot(true);
        storageService.resolveFolder(newRoot);

        try {
            return folderRepository.saveAndFlush(newRoot);
        } catch (DataIntegrityViolationException e) {
            return folderRepository
                    .findByOwnerIdAndIsRootTrue(userId)
                    .orElseThrow(() -> e);
        }
    }

    @Override
    @Transactional
    public Folder createFolder(CreateFolderRequestDto request) {

        Folder prev = folderRepository.findByNameAndParentAndOwnerId(request.folderName(),
                Folder.builder().id(request.parentId()).build(), currentUser.userId()).orElse(null);
        System.out.println(prev);
        if (prev != null) {
            throw new BusinessException(StorageExceptions.DUPLICATE_FOLDER);
        }

        Folder folder = Folder.builder().name(request.folderName())
                .parent(Optional.ofNullable(request.parentId()).map(folderId -> getFolderById(folderId)).orElse(null))
                .ownerId(currentUser.userId())
                .build();
        storageService.resolveFolder(folder);
        return folderRepository.save(folder);
    }

    @Override
    @Transactional
    public Folder updateFolder(FolderUpdateRequestDto request) {

        Folder folder = getFolderById(request.id());

        if (!currentUser.userId().equals(folder.getOwnerId())) {
            throw new BusinessException(
                    SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to do this operation!");
        }

        switch (request.type()) {

            case MOVE:

                if (folder.isRoot()) {
                    throw new BusinessException(
                            StorageExceptions.MOVEMENT_NOT_ALLOWED,
                            "The root folder cannot be moved!");
                }

                Folder destination = getFolderById(request.targetId());

                if (!currentUser.userId().equals(destination.getOwnerId())) {
                    throw new BusinessException(
                            SecurityExceptions.FORBIDDEN_ACCESS,
                            "You are not allowed to move the folder there!");
                }

                if (folder.getId().equals(destination.getId())) {
                    throw new BusinessException(
                            StorageExceptions.MOVEMENT_NOT_ALLOWED,
                            "A folder cannot be moved into itself!");
                }

                if (isDescendant(folder, destination)) {
                    throw new BusinessException(
                            StorageExceptions.MOVEMENT_NOT_ALLOWED,
                            "A folder cannot be moved into one of its descendants!");
                }

                if (folder.getParent() != null &&
                        folder.getParent().getId().equals(destination.getId())) {
                    throw new BusinessException(
                            StorageExceptions.MOVEMENT_NOT_ALLOWED,
                            "The folder is already inside the selected folder!");
                }

                // This is the actual move
                folder.setParent(destination);

                return folderRepository.save(folder);

            default:
                folder.setName(request.name());
                return folderRepository.save(folder);
        }
    }

    private boolean isDescendant(Folder folder, Folder destination) {

        Folder current = destination.getParent();

        while (current != null) {

            if (current.getId().equals(folder.getId())) {
                return true;
            }

            current = current.getParent();
        }

        return false;
    }

    @Override
    @Transactional
    public boolean deleteFolder(UUID folderId) {

        Folder folder = getFolderById(folderId);
        if (!currentUser.userId().equals(folder.getOwnerId())) {
            throw new BusinessException(SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to do this operation!");
        }

        folder.setDeleted(true);
        folder.getChildren().forEach(child -> {
            child.setDeleted(true);
            child.getFiles().forEach(file -> file.setDeleted(true));
        });
        folderRepository.delete(folder);

        return true;
    }

}
