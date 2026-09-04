package com.cbss.storage.services;

import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;

import com.cbss.storage.models.Folder;

public interface StorageService {

    List<String> getBreadcrumbPath(UUID folderId);

    Path getMyRootDirectory();

    Path getPathForFolder(UUID folderId);

    Path resolveFolder(Folder folder);

    Resource loadAsResource(String filePath);

}