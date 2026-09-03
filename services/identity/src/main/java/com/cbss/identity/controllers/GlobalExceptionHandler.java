package com.cbss.identity.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cbss.identity.enums.ApplicationExceptions;
import com.cbss.identity.enums.IdentityExceptions;
import com.cbss.identity.exceptions.BusinessException;
import com.cbss.identity.exceptions.EmailAlreadyUsedException;
import com.cbss.identity.exceptions.ForbiddenException;
import com.cbss.identity.exceptions.InvalidRefreshTokenException;
import com.cbss.identity.exceptions.ResourceNotFoundException;
import com.platform.web.exception.ErrorDefinition;
import com.platform.web.exception.SecurityExceptions;
import com.platform.web.model.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ErrorResponse> handle(InvalidRefreshTokenException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(SecurityExceptions.INVALID_TOKEN, e.getMessage()));
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(IdentityExceptions.BAD_CREDENTIALS));
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(EmailAlreadyUsedException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(IdentityExceptions.DUPLICATE_RESOURCE_FOUND, e.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
                .body(new ErrorResponse(IdentityExceptions.RESOURCE_NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {

        Optional.ofNullable(e.getCause()).ifPresent(er -> er.printStackTrace());

        ErrorDefinition definition = Optional.ofNullable(e.getException())
                .orElse(ApplicationExceptions.UNEXPECTED_EXCEPTION);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(definition,
                Optional.ofNullable(e.getMessage()).orElse(definition.getErrorMessage())));
    }

    @ExceptionHandler({ ForbiddenException.class, AccessDeniedException.class })
    public ResponseEntity<ErrorResponse> handleForbiddenException(Exception e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(SecurityExceptions.FORBIDDEN_ACCESS, e.getMessage()));
    }

}
