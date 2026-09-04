package com.cbss.storage.services;

import java.util.UUID;

import com.cbss.storage.dto.CreateFolderRequestDto;
import com.cbss.storage.dto.DirectoryResponseDto;
import com.cbss.storage.dto.FolderUpdateRequestDto;
import com.cbss.storage.dto.TreeResponseDto;
import com.cbss.storage.models.Folder;

public interface FolderService {

    Folder getFolderById(UUID id);

    DirectoryResponseDto getDirectory(Folder folder);

    TreeResponseDto getTree();

    Folder getMyRootDirectory();

    Folder getOrCreateRootFolder();

    Folder createRootDirectory(UUID userId, String email);

    Folder createFolder(CreateFolderRequestDto request);

    Folder updateFolder(FolderUpdateRequestDto request);

    boolean deleteFolder(UUID folderId);

}