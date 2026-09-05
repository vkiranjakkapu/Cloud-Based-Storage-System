package com.cbss.storage.dto;

import java.util.UUID;

public record ShareUserRequestDto(String email, UUID userId) {
    
}
