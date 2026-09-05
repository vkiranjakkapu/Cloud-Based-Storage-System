package com.cbss.reports.models;

import java.time.LocalDateTime;
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
public class MetaFile {

    private UUID id;

    private String fileName;

    private String filePath;

    private long fileSize;

    private Folder folder;

    private String mimeType;

    private UUID ownerId;

    private Set<FileAccess> accesses;

    @Builder.Default
    private Set<SharedFile> shares = new HashSet<>();

    @Builder.Default
    private boolean isLatest = true;

    @Builder.Default
    private boolean isDeleted = false;

    private LocalDateTime modifiedDate;

    private LocalDateTime createdAt;

}
