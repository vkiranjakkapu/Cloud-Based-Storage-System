package com.cbss.storage.dto;

import java.util.ArrayList;
import java.util.List;

import com.cbss.storage.models.SharedFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileSharingResponseDto {

    List<SharedFile> shares;
    @Builder.Default
    List<String> info = new ArrayList<>();

}
