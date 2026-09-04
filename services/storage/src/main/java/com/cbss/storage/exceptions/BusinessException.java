package com.cbss.storage.exceptions;

import com.platform.web.exception.ErrorDefinition;

public class BusinessException extends RuntimeException {

    private ErrorDefinition exception;

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(ErrorDefinition exception) {
        this.exception = exception;
    }

    public BusinessException(ErrorDefinition exception, String message) {
        super(message);
        this.exception = exception;
    }

    public BusinessException(ErrorDefinition exception, String message, Throwable e) {
        super(message, e);
        this.exception = exception;
    }

    public ErrorDefinition getException() {
        return exception;
    }

    public void setException(ErrorDefinition exception) {
        this.exception = exception;
    }

}
