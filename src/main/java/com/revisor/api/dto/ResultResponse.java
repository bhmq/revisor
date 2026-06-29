package com.revisor.api.dto;

import com.revisor.api.model.ResultStatus;

import java.time.Instant;

public record ResultResponse(
        String url,
        ResultStatus status,
        Integer httpCode,
        String errorMessage,
        Instant checkedAt
) {
}
