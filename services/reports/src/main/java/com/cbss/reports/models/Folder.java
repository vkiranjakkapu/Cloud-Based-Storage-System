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
public class Folder {

    private UUID id;

    private UUID ownerId;

    private String name;

    @Builder.Default
    private boolean isRoot = false;

    private Folder parent;

    @Builder.Default
    private Set<Folder> children = new HashSet<>();

    @Builder.Default
    private Set<MetaFile> files = new HashSet<>();

    private Group group;

    @Builder.Default
    private boolean isDeleted = false;

    private Instant updatedAt;

    private Instant createdAt;
}