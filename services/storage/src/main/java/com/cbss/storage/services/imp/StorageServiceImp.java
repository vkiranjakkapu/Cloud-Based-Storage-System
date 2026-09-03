package com.cbss.storage.services.imp;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.FolderService;
import com.cbss.storage.services.StorageService;

@Service
public class StorageServiceImp implements StorageService {

    private CurrentUserService userService;
    private FolderService folderService;
    private Path basePath;

    public StorageServiceImp(CurrentUserService userService, FolderService folderService,
            @Value("${storage.local-storage.base-path}") String basePath) {
        this.userService = userService;
        this.folderService = folderService;
        this.basePath = Path.of(basePath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.basePath);
        } catch (IOException e) {
            throw new BusinessException(StorageExceptions.STORAGE_FAILED, "Could not create the root directory.", e);
        }
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
        String subPath = String.join(File.separator, folderService.getBreadcrumbPath(folderId));
        return Path.of(subPath);
    }

}
