package com.cbss.storage.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.dto.UploadRequest;
import com.cbss.storage.services.MetaFileService;

@RestController
@RequestMapping("/storage/api/v1/uploads")
public class UploadsController {

    private MetaFileService metaFileService;

    public UploadsController(MetaFileService metaFileService) {
        this.metaFileService = metaFileService;
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> uploadDocument(UploadRequest request) {
        return ResponseEntity.ok(APIResponseDto.builder().data(metaFileService.createFile(request)).build());
    }

}
