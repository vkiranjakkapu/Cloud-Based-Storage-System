package com.cbss.reports.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cbss.reports.models.FileAccess;
import com.cbss.reports.models.SharedFile;

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
