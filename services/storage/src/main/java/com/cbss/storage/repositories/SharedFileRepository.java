package com.cbss.storage.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbss.storage.models.MetaFile;
import com.cbss.storage.models.SharedFile;

public interface SharedFileRepository extends JpaRepository<SharedFile, UUID> {

    List<SharedFile> findAllByTargetUserIdAndFileAndExpiryAfter(UUID userId, MetaFile file, LocalDateTime now);

    List<SharedFile> findAllByTargetUserIdAndExpiryAfter(UUID userId, LocalDateTime now);

}
