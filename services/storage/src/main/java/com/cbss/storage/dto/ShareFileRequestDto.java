package com.cbss.storage.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ShareFileRequestDto(UUID fileId, List<ShareUserRequestDto> users, LocalDateTime expiry) {

}
