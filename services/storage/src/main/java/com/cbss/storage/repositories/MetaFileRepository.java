package com.cbss.storage.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbss.storage.models.MetaFile;

public interface MetaFileRepository extends JpaRepository<MetaFile, UUID> {

}
