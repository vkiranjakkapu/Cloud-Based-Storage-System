package com.cbss.storage.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.dto.CreateFolderRequestDto;
import com.cbss.storage.dto.FolderUpdateRequestDto;
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
        return ResponseEntity.ok(
                APIResponseDto.builder().data(folderService.getDirectory(folderService.getMyRootDirectory())).build());
    }

    @GetMapping("/tree")
    public ResponseEntity<APIResponseDto> getTree() {
        return ResponseEntity.ok(
                APIResponseDto.builder().data(folderService.getTree()).build());
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<APIResponseDto> getContentsByFolderByName(@PathVariable UUID folderId) {
        return ResponseEntity.ok(
                APIResponseDto.builder().data(folderService.getDirectory(folderService.getFolderById(folderId)))
                        .build());
    }

    @PostMapping("/createroot/{userId}/{email}")
    public ResponseEntity<APIResponseDto> createRootDirectory(@PathVariable UUID userId, @PathVariable String email) {
        Folder root = folderService.createRootDirectory(userId, email);
        return ResponseEntity.ok(APIResponseDto.builder().data(root).build());
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> createFolder(@RequestBody CreateFolderRequestDto request) {
        Folder root = folderService.createFolder(request);
        return ResponseEntity.ok(APIResponseDto.builder().data(root).build());
    }

    @PatchMapping("/")
    public ResponseEntity<APIResponseDto> updateFolder(@RequestBody FolderUpdateRequestDto request) {
        Folder root = folderService.updateFolder(request);
        return ResponseEntity.ok(APIResponseDto.builder().data(root).build());
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<APIResponseDto> deleteFolder(@PathVariable UUID folderId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(folderService.deleteFolder(folderId)).build());
    }

}
