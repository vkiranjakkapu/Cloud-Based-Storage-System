package com.cbss.storage.dto;

import java.util.UUID;

import com.cbss.storage.enums.UpdateType;

import jakarta.validation.constraints.NotEmpty;

public record FileUpdateRequestDto(
		@NotEmpty UUID id,
		@NotEmpty String name,
		UUID targetId,
		@NotEmpty UpdateType type) {

}
