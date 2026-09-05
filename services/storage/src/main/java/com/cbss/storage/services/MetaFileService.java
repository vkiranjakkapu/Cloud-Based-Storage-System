package com.cbss.storage.services;

import java.util.List;
import java.util.UUID;

import com.cbss.storage.dto.FileReportResponseDto;
import com.cbss.storage.dto.FileUpdateRequestDto;
import com.cbss.storage.dto.LatestFileDto;
import com.cbss.storage.dto.UploadRequest;
import com.cbss.storage.models.MetaFile;

public interface MetaFileService {

    MetaFile getFileById(UUID fileId);

    List<MetaFile> getFileVersions(UUID fileId);

    List<LatestFileDto> getLatestFiles();

    List<FileReportResponseDto> getFileReports();

    MetaFile createFile(UploadRequest document);

    MetaFile updateFile(FileUpdateRequestDto request);

    MetaFile renameFile(UUID fileId, String newName);

    boolean deleteFile(UUID fileId);

}