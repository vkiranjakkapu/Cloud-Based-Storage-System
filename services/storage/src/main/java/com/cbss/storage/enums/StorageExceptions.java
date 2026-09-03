package com.cbss.storage.enums;

import com.platform.web.exception.ErrorDefinition;

public enum StorageExceptions implements ErrorDefinition {

    ILLEGAL_ARGUMENTS("ILLEGAL_ARGUMENTS", "BUS-4003", "Inputs are invalid."),
    STORAGE_FAILED("STORAGE_FAILED", "BUS-4004", "Error while storing file."),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "BUS-2004", "Resource supplied not found."),
    DELETED_RESOURCE_ACCESS("DELETED_RESOURCE_ACCESS", "BUS-4041", "This Resource has been deleted.");

    private final String errorName;
    private final String errorCode;
    private final String errorMessage;

    StorageExceptions(String errorName,
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