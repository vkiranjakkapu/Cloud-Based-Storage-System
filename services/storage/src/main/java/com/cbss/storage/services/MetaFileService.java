package com.cbss.storage.services;

import com.cbss.storage.dto.UploadRequest;
import com.cbss.storage.models.MetaFile;

public interface MetaFileService {

    MetaFile createFile(UploadRequest document);

}