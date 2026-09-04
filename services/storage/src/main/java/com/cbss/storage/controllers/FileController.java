package com.cbss.storage.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.dto.FileUpdateRequestDto;
import com.cbss.storage.services.MetaFileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/storage/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final MetaFileService fileService;

    @GetMapping("/{fileId}")
    public ResponseEntity<APIResponseDto> getFileById(@PathVariable UUID fileId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(fileService.getFileById(fileId)).build());
    }

    @GetMapping("/versions/{fileId}")
    public ResponseEntity<APIResponseDto> getFileVersions(@PathVariable UUID fileId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(fileService.getFileVersions(fileId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> updateFile(@RequestBody FileUpdateRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().data(fileService.updateFile(request)).build());
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<APIResponseDto> deleteFile(@PathVariable UUID fileId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(fileService.deleteFile(fileId)).build());
    }

}
