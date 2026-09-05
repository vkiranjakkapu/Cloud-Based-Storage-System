package com.cbss.reports.models;

import java.time.Instant;
import java.util.UUID;

import com.cbss.reports.enums.AccessType;

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
public class FileAccess {

    private Long id;

    private MetaFile file;

    private UUID userId;

    private Group group;

    @Builder.Default

    private AccessType type = AccessType.MEMBER;

    private Instant createdAt;

}
