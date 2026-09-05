package com.cbss.storage.dto;

import com.cbss.storage.models.SharedFile;
import com.cbss.storage.models.User;

import lombok.Builder;

@Builder
public record AccessRecordDto(SharedFile share, User user) {

}
