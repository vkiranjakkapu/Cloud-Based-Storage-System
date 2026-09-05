package com.cbss.storage.dto;

import java.time.LocalDateTime;

import com.cbss.storage.models.MetaFile;
import com.cbss.storage.models.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class LatestFileDto {
	MetaFile file;
	User owner;
	LocalDateTime createdAt;
	boolean shared;
}
