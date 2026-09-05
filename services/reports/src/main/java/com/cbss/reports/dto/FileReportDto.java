package com.cbss.reports.dto;

import lombok.Builder;

@Builder
public record FileReportDto(
		String type,
		Integer totalSize,
		Integer fileCount) {
}