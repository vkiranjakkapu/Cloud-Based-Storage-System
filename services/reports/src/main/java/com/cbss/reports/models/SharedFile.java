package com.cbss.reports.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.cbss.reports.enums.ShareType;

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
public class SharedFile {

    private UUID id;

    private MetaFile file;

    @Builder.Default
    private ShareType type = ShareType.PRIVATE;

    private UUID targetUserId;

    private LocalDateTime expiry;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}
