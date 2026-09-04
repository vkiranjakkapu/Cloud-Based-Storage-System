package com.cbss.identity.services.imp;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.cbss.identity.exceptions.BusinessException;
import com.cbss.identity.exceptions.InternalCommunicationException;
import com.cbss.identity.repository.UserRepository;
import com.cbss.identity.services.JwtService;

@Service
public class StorageService {

    private RestClient restClient;
    private JwtService jwtService;
    private UserRepository userRepository;

    @Value("${services.uri.storage}")
    private String STORAGE_SERVICE_URL;

    public StorageService(@LoadBalanced RestClient.Builder builder, UserRepository userRepository,
            JwtService jwtService) {
        this.restClient = builder.build();
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public void createRootDirectoryForUser(UUID userId, String email) {
        String accessToken = jwtService.generateAccessToken(userRepository.findById(userId).orElse(null));
        try {
            restClient.post().uri(STORAGE_SERVICE_URL + "/createroot/" + userId + "/" + email)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(Object.class);
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException("Error Connecting Storage Service.", e);
        }
    }

}
