package com.revisor.api.dto;

public record RunStartResponse(
        Long runId,
        Long testId,
        String testName,
        String status,
        int total,
        int checked,
        int progressPercent
) {
}
