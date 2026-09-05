package com.cbss.storage.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.cbss.storage.enums.UserGender;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class User {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dob;
    private UserGender gender;
    private Address address;
    private boolean enabled;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Role> roles;
}
