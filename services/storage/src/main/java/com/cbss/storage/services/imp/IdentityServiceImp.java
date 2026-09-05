package com.cbss.storage.services.imp;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.cbss.storage.dto.FetchUsersRequestDto;
import com.cbss.storage.dto.RestResponseDto;
import com.cbss.storage.dto.UserResponse;
import com.cbss.storage.exceptions.InternalCommunicationException;
import com.cbss.storage.exceptions.ResourceNotFoundException;
import com.cbss.storage.models.User;

@Service
public class IdentityServiceImp {

    private final RestClient restClient;

    @Value("${services.uri.identity}")
    private String IDENTITY_SERVICE_URL;

    public IdentityServiceImp(@LoadBalanced RestClient.Builder builder) {

        this.restClient = builder.build();
    }

    public Map<UUID, User> getAllUsersByIds(Set<UUID> userIds) {
        return fetchUsers(userIds).stream()
                .collect(Collectors.toMap(UserResponse::id, u -> prepareUser(u), (existing, replacing) -> existing));
    }

    private User prepareUser(UserResponse userResponse) {
        return User.builder()
                .id(userResponse.id())
                .email(userResponse.email())
                .firstName(userResponse.firstName())
                .lastName(userResponse.lastName())
                .phone(userResponse.phone())
                .dob(userResponse.dob())
                .gender(userResponse.gender())
                .address(userResponse.address())
                .enabled(userResponse.enabled())
                .build();
    }

    private List<UserResponse> fetchUsers(Set<UUID> ids) {
        try {
            RestResponseDto<List<UserResponse>> body = restClient.post().uri(IDENTITY_SERVICE_URL + "/users/search")
                    .body(FetchUsersRequestDto.builder()
                            .ids(ids).build())
                    .retrieve().body(new ParameterizedTypeReference<RestResponseDto<List<UserResponse>>>() {
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
