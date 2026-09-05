package com.cbss.storage.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbss.storage.dto.APIResponseDto;
import com.cbss.storage.dto.ShareFileRequestDto;
import com.cbss.storage.services.ShareService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/storage/api/v1/shares")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;

    @GetMapping("/")
    public ResponseEntity<APIResponseDto> getAllSharedFiles() {
        return ResponseEntity.ok(APIResponseDto.builder().data(shareService.getSharedFiles()).build());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponseDto> getAllSharedFiles(@PathVariable UUID userId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(shareService.getSharedFiles(userId)).build());
    }

    @GetMapping("/users/{fileId}")
    public ResponseEntity<APIResponseDto> getSharedWithUsers(@PathVariable UUID fileId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(shareService.getSharedWithUsers(fileId)).build());
    }

    @PostMapping("/")
    public ResponseEntity<APIResponseDto> shareFileWithUsers(@RequestBody ShareFileRequestDto request) {
        return ResponseEntity.ok(APIResponseDto.builder().data(shareService.shareFileWithUserIds(request)).build());
    }

    @DeleteMapping("/{accessId}")
    public ResponseEntity<APIResponseDto> removeShareAccess(@PathVariable UUID accessId) {
        return ResponseEntity.ok(APIResponseDto.builder().data(shareService.removeShareAccess(accessId)).build());
    }

}
