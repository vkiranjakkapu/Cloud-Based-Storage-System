package com.cbss.storage.dto;

import java.util.List;

import com.cbss.storage.models.MetaFile;

import lombok.Builder;

@Builder
public record FileResponseDto(List<MetaFile> versions) {

}
