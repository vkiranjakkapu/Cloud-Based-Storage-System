package com.cbss.storage.models;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetaFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 100)
    private String fileName;

    private String filePath;

    private long fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    private Folder folder;

    private String mimeType;

    private UUID ownerId;

    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL)
    private Set<FileAccess> accesses;

    @OneToMany(mappedBy = "file")
    @Builder.Default
    private Set<SharedFile> shares = new HashSet<>();

    @Builder.Default
    private boolean isLatest = true;

    @Builder.Default
    private boolean isDeleted = false;

    @UpdateTimestamp
    private LocalDateTime modifiedDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
