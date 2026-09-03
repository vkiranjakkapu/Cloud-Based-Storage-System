package com.cbss.storage.services;

import java.util.List;
import java.util.UUID;

import com.cbss.storage.dto.DirectoryResponseDto;
import com.cbss.storage.dto.FolderUpdateRequestDto;
import com.cbss.storage.models.Folder;

public interface FolderService {

    Folder getFolderById(UUID id);

    List<String> getBreadcrumbPath(UUID folderId);

    DirectoryResponseDto getDirectory(Folder folder);

    Folder getMyRootDirectory();

    Folder getOrCreateRootFolder();

    Folder createRootDirectory(UUID userId, String email);

    Folder createFolder(Folder folder);

    Folder updateFolder(FolderUpdateRequestDto request);

}