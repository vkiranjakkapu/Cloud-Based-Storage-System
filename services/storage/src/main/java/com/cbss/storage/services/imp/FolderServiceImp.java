package com.cbss.storage.services.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cbss.storage.dto.DirectoryResponseDto;
import com.cbss.storage.dto.FolderUpdateRequestDto;
import com.cbss.storage.enums.SecurityExceptions;
import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.enums.UpdateType;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.models.Folder;
import com.cbss.storage.repositories.FolderRepository;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.FolderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderServiceImp implements FolderService {

    private final FolderRepository folderRepository;
    private final CurrentUserService currentUser;

    @Override
    @Transactional
    public Folder getFolderById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
                        "Folder with given ID not found!"));
    }

    @Override
    @Transactional
    public List<String> getBreadcrumbPath(UUID folderId) {
        Folder folder = folderRepository.findByIdWithParent(folderId)
                .orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND, "Folder not found"));

        List<String> pathComponents = new ArrayList<>();
        Folder current = folder;

        while (current != null) {
            pathComponents.add(0, current.getName());
            current = current.getParent();
        }

        return pathComponents;
    }

    @Override
    @Transactional
    public DirectoryResponseDto getDirectory(Folder folder) {
        return DirectoryResponseDto.builder()
                .subFolders(folder.getChildren())
                .files(folder.getFiles())
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
    public Folder createFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    @Override
    @Transactional
    public Folder updateFolder(FolderUpdateRequestDto request) {

        Folder folder = getFolderById(request.id());
        if (!currentUser.userId().equals(folder.getOwnerId())) {
            throw new BusinessException(SecurityExceptions.FORBIDDEN_ACCESS,
                    "You are not allowed to do this operation!");
        }

        switch (request.type()) {
            case UpdateType.MOVE:

                Folder parent = folder.getParent();
                Folder destination = getFolderById(request.targetId());

                if (folder.isRoot()) {
                    destination.addChild(folder);
                    folderRepository.saveAll(List.of(folder, destination));
                } else {
                    parent.removeChild(folder);
                    destination.addChild(folder);
                    folderRepository.saveAll(List.of(folder, parent, destination));
                }

                return folder;

            case UpdateType.DELETE:
                folder.setDeleted(true);
                folder.getChildren().forEach(child -> {
                    child.setDeleted(true);
                    child.getFiles().forEach(file -> file.setDeleted(true));
                });
                return folderRepository.save(folder);

            default:
                folder.setName(request.name());
                return folderRepository.save(folder);
        }
    }

}
