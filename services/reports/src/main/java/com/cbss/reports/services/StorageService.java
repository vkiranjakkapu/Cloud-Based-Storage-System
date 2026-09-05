package com.cbss.reports.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.cbss.reports.dto.FileReportResponseDto;
import com.cbss.reports.dto.RestResponseDto;
import com.cbss.reports.exceptions.InternalCommunicationException;
import com.cbss.reports.exceptions.ResourceNotFoundException;

@Service
public class StorageService {

    private RestClient restClient;

    @Value("${services.uri.storage}")
    private String STORAGE_SERVICE_URL;

    public StorageService(@LoadBalanced RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public List<FileReportResponseDto> getFileReports() {
        try {
            RestResponseDto<List<FileReportResponseDto>> body = restClient.get()
                    .uri(STORAGE_SERVICE_URL + "/reports/files")
                    .retrieve().body(new ParameterizedTypeReference<RestResponseDto<List<FileReportResponseDto>>>() {
                    });
            return body.getData();
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

}
