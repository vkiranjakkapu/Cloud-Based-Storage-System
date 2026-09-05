package com.cbss.storage.dto;

import java.util.List;

import com.cbss.storage.models.SharedFile;

import lombok.Builder;

@Builder
public record SharedFilesResponseDto(List<SharedFile> sharedFiles) {
}