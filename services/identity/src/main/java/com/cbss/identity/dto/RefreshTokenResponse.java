package com.cbss.identity.dto;

public record RefreshTokenResponse(
		String accessToken,
		String refreshToken) {
}
