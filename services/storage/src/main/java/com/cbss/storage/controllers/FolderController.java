package com.cbss.storage.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.models.Folder;
import com.cbss.storage.services.FolderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/storage/api/v1")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllFiles() {

        return ResponseEntity.ok(APIResponseDto.builder().data(null).build());
    }

    @PostMapping("/createroot/{userId}/{email}")
    public ResponseEntity<APIResponseDto> createRootDirectory(@PathVariable UUID userId, @PathVariable String email) {
        Folder root = folderService.createRootDirectory(userId, email);
        return ResponseEntity.ok(APIResponseDto.builder().data(root).build());
    }

}
