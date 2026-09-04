package com.cbss.storage.services.imp;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.models.Folder;
import com.cbss.storage.repositories.FolderRepository;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.StorageService;

@Service
public class StorageServiceImp implements StorageService {

    private FolderRepository folderRepository;
    private CurrentUserService userService;
    private Path basePath;

    public StorageServiceImp(FolderRepository folderRepository, CurrentUserService userService,
            @Value("${storage.local-storage.base-path}") String basePath) {
        this.folderRepository = folderRepository;
        this.userService = userService;
        this.basePath = Path.of(basePath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.basePath);
        } catch (IOException e) {
            throw new BusinessException(StorageExceptions.STORAGE_FAILED, "Could not create the root directory.", e);
        }
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
    public Path getMyRootDirectory() {
        Path userDir = this.basePath.resolve(userService.userId().toString());
        try {
            if (!Files.exists(userDir))
                Files.createDirectories(userDir);
        } catch (IOException e) {
            throw new BusinessException(StorageExceptions.STORAGE_FAILED, "Could not create the directory for user.",
                    e);
        }
        return userDir;
    }

    @Override
    public Path getPathForFolder(UUID folderId) {
        String subPath = String.join(File.separator, getBreadcrumbPath(folderId));
        return Path.of(subPath);
    }

    @Override
    public Path resolveFolder(Folder folder) {
        Path folderPath;
        if (folder.getParent() == null) {
            folderPath = getMyRootDirectory().resolve(folder.getName());
        } else {
            folderPath = getMyRootDirectory()
                    .resolve(getPathForFolder(folder.getParent().getId()).resolve(folder.getName()));
        }
        try {
            if (!Files.exists(folderPath))
                Files.createDirectories(folderPath);
        } catch (IOException e) {
            throw new BusinessException(StorageExceptions.STORAGE_FAILED,
                    "Could not create directory [" + folder.getName() + "]",
                    e);
        }
        System.out.println(folderPath);
        return folderPath;
    }

}
