package com.cbss.storage.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cbss.storage.models.Folder;

public interface FolderRepository extends JpaRepository<Folder, UUID> {

    @Query("SELECT f FROM Folder f LEFT JOIN FETCH f.parent WHERE f.id = :id")
    Optional<Folder> findByIdWithParent(@Param("id") UUID id);

    List<Folder> findByOwnerId(UUID userId);

    Optional<Folder> findByOwnerIdAndIsRootTrue(UUID userId);

    List<Folder> findAllByParentAndIsDeletedFalse(Folder parent);

}
