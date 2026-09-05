package com.cbss.storage.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cbss.storage.models.FileAccess;
import com.cbss.storage.models.SharedFile;

import lombok.Builder;

@Builder
public record FileReportResponseDto(
		UUID id,
		String fileName,
		String filePath,
		long fileSize,
		String mimeType,
		UUID ownerId,
		Set<FileAccess> accesses,
		Set<SharedFile> shares,
		LocalDateTime modifiedDate,
		LocalDateTime createdAt) {

}
