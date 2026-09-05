package com.cbss.storage.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.cbss.storage.enums.ShareType;
import com.cbss.storage.models.MetaFile;
import com.cbss.storage.models.User;

import lombok.Builder;

@Builder
public record SharedFileResponseDto(
        UUID id,
        MetaFile file,
        User owner,
        ShareType type,
        UUID targetUserId,
        LocalDateTime expiry,
        LocalDateTime updatedAt,
        LocalDateTime createdAt) {

}
