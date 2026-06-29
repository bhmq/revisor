package com.revisor.api.exception;

public record ApiError(
        int status,
        String message
) {
}
