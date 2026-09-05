package com.cbss.reports.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.reports.dto.APIResponseDto;
import com.cbss.reports.services.ReportsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports/api/v1")
@RequiredArgsConstructor
public class StorageReportsController {

    private final ReportsService reportsService;

    @GetMapping("/files")
    public ResponseEntity<APIResponseDto> getFileReports() {
        return ResponseEntity.ok(APIResponseDto.builder().data(reportsService.getFileReports()).build());
    }

}
