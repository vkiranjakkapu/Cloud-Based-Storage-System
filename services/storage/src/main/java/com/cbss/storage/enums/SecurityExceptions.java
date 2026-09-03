package com.cbss.storage.enums;

import com.platform.web.exception.ErrorDefinition;

public enum SecurityExceptions implements ErrorDefinition {

    FORBIDDEN_ACCESS("FORBIDDEN_ACCESS", "SEC-4031", "Non-Owner cross access detected."),
    ACCESS_EXPIRED("ACCESS_EXPIRED", "SEC-4032", "Resource access expired.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    SecurityExceptions(String errorName,
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
