package com.cbss.storage.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;

public record CreateFolderRequestDto(UUID parentId, @NotEmpty String folderName) {

}
