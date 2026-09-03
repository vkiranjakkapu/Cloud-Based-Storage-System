package com.cbss.storage.services;

import java.nio.file.Path;
import java.util.UUID;

public interface StorageService {

    Path getMyRootDirectory();

    Path getPathForFolder(UUID folderId);

}