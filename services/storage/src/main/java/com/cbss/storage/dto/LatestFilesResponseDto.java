package com.cbss.storage.dto;

import java.util.List;

import lombok.Builder;

@Builder 
public record LatestFilesResponseDto(List<LatestFileDto> latestFiles) {
    
}
