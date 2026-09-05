package com.cbss.storage.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cbss.storage.enums.RoleType;
import com.cbss.storage.enums.UserGender;
import com.cbss.storage.models.Address;

import lombok.Builder;

@Builder
public record UserResponse(UUID id,
		String email,
		String firstName,
		String lastName,
		String phone,
		LocalDate dob,
		UserGender gender,
		Address address,
		boolean enabled,
		Set<RoleType> roles,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}