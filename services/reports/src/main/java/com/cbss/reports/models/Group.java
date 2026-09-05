package com.cbss.reports.models;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

	private UUID id;

	private String title;

	private String description;

	@Builder.Default
	private Set<FileAccess> files = new HashSet<>();

	private Set<Folder> folders;

	@Builder.Default
	private Set<GroupParticipant> participants = new HashSet<>();

	private Instant createdAt;

}
