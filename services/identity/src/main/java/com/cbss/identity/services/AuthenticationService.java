package com.cbss.identity.services;

import com.cbss.identity.dto.LoginRequestDto;
import com.cbss.identity.dto.LoginResponseDto;
import com.cbss.identity.dto.LogoutRequestDto;
import com.cbss.identity.dto.RefreshTokenRequest;
import com.cbss.identity.dto.RefreshTokenResponse;

public interface AuthenticationService {

    LoginResponseDto login(LoginRequestDto request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(LogoutRequestDto request);

}