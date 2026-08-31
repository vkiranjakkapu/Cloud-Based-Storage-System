package com.cbss.identity.services;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import com.cbss.identity.dto.CreateUserRequestDto;
import com.cbss.identity.dto.PasswordChangeRequestDto;
import com.cbss.identity.dto.RegistrationRequest;
import com.cbss.identity.dto.UpdateUserRequest;
import com.cbss.identity.dto.UserResponse;
import com.cbss.identity.entities.RoleType;

public interface UserService {
    UserResponse createUser(CreateUserRequestDto request);

    List<UserResponse> getAllUsers();

    List<UserResponse> getAllUsersByRole(RoleType role);

    List<UserResponse> getAllUsersWithIds(Collection<UUID> ids);

    UserResponse getUserById(UUID id);

    UserResponse getUserByEmail(String email);

    UserResponse updateUser(UUID id, UpdateUserRequest request);

    UserResponse register(RegistrationRequest request);

    UserResponse changePassword(PasswordChangeRequestDto request);

    void deleteUser(UUID id);
}