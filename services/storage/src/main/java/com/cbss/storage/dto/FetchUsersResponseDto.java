package com.cbss.storage.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record FetchUsersResponseDto(List<UserResponse> users) {

}
