package com.cbss.storage.models;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import com.cbss.storage.enums.ShareType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "file_sharing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private MetaFile file;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ShareType type = ShareType.PRIVATE;

    private UUID userId;

    private LocalDateTime expiry;

    private Instant updatedAt;

    private Instant createdAt;

}
