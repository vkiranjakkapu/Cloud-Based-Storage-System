package com.cbss.storage.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.services.MetaFileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/storage/api/v1/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final MetaFileService fileService;

    @GetMapping("/files")
    public ResponseEntity<APIResponseDto> getFileReeports() {
        return ResponseEntity.ok(APIResponseDto.builder().data(fileService.getFileReports()).build());
    }

}
