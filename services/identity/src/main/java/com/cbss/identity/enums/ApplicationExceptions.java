package com.cbss.identity.enums;

import com.platform.web.exception.ErrorDefinition;

public enum ApplicationExceptions implements ErrorDefinition {

    UNEXPECTED_EXCEPTION("UNEXPECTED_EXCEPTION", "4002", "Unexpected error has occured.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    ApplicationExceptions(String errorName,
            String errorCode,
            String errorMessage) {
        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return this.errorName;
    }

    @Override
    public String getErrorCode() {
        return this.errorCode;
    }

    @Override
    public String getErrorMessage() {
        return this.errorMessage;
    }

}
