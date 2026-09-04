package com.cbss.storage.dto;

import java.util.List;
import java.util.Set;

import com.cbss.storage.models.Folder;
import com.cbss.storage.models.MetaFile;

import lombok.Builder;

@Builder
public record DirectoryResponseDto(Folder current, List<Folder> parentFolders,Set<Folder> subFolders, Set<MetaFile> files) {

}
