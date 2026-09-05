package com.cbss.reports.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cbss.reports.dto.FileReportDto;
import com.cbss.reports.dto.FileReportResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportsService {

	private final StorageService storageService;

	public List<FileReportDto> getFileReports() {

		List<FileReportResponseDto> fileReports = storageService.getFileReports();

		return fileReports.stream()
				.collect(Collectors.groupingBy(file -> file.mimeType()))
				.entrySet()
				.stream()
				.map(entry -> FileReportDto.builder()
						.type(entry.getKey())
						.totalSize(Math.toIntExact(
								entry.getValue().stream()
										.mapToLong(file -> file.fileSize())
										.sum()))
						.fileCount(entry.getValue().size())
						.build())
				.toList();
	}

}
