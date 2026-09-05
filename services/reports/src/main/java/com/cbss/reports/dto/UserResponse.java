package com.cbss.reports.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cbss.reports.enums.RoleType;
import com.cbss.reports.enums.UserGender;
import com.cbss.reports.models.Address;

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