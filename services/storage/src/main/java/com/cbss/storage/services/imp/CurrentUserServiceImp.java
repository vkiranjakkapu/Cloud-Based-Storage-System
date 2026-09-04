package com.cbss.storage.services.imp;

import java.util.Collection;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.platform.security.context.AuthenticationContext;
import com.platform.security.model.AuthenticatedUser;
import com.cbss.storage.exceptions.ForbiddenException;
import com.cbss.storage.services.CurrentUserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImp implements CurrentUserService {

    private final AuthenticationContext authenticationContext;

    @Override
    public AuthenticatedUser currentUser() {
        return authenticationContext.getCurrentUser()
                .orElseThrow(() -> new ForbiddenException("No authenticated user"));
    }

    @Override
    public UUID userId() {
        return UUID.fromString(currentUser().getUserId());
    }

    @Override
    public String username() {
        return currentUser().getUsername();
    }

    @Override
    public String email() {
        return currentUser().getEmail();
    }

    @Override
    public Collection<String> authorities() {
        return currentUser().getAuthorities();
    }

    @Override
    public boolean isAdmin() {
        return currentUser().getAuthorities().contains("ROLE_ADMIN");
    }

    @Override
    public boolean isAgent() {
        return currentUser().getAuthorities().contains("ROLE_AGENT");
    }

    @Override
    public boolean isCustomer() {
        return currentUser().getAuthorities().contains("ROLE_CUSTOMER");
    }

}
