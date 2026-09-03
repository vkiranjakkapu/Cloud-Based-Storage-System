package com.cbss.storage.dto;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

@Builder
public record UploadRequest(
		UUID folderId,
		@NotEmpty MultipartFile file) {

}
