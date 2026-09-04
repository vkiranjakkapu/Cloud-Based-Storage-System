package com.cbss.storage.dto;

import java.util.Set;

import com.cbss.storage.models.Folder;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class TreeResponseDto {
    private Folder parent;
    private Set<TreeResponseDto> children;
}