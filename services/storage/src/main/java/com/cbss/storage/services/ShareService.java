package com.cbss.storage.services;

import java.util.List;
import java.util.UUID;

import com.cbss.storage.dto.AccessRecordDto;
import com.cbss.storage.dto.FileSharingResponseDto;
import com.cbss.storage.dto.ShareFileRequestDto;
import com.cbss.storage.dto.SharedFileResponseDto;
import com.cbss.storage.models.SharedFile;

public interface ShareService {

    List<SharedFileResponseDto> getSharedFiles();

    List<SharedFile> getSharedFiles(UUID userId);

    List<AccessRecordDto> getSharedWithUsers(UUID fileId);

    FileSharingResponseDto shareFileWithUserIds(ShareFileRequestDto request);

    boolean removeShareAccess(UUID accessId);

}