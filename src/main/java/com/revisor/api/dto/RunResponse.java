package com.revisor.api.dto;

import java.time.Instant;
import java.util.List;

public record RunResponse(
        Long runId,
        Long testId,
        String testName,
        String status,
        int total,
        int checked,
        long okCount,
        long httpErrorCount,
        long failedCount,
        int progressPercent,
        Instant createdAt,
        Instant finishedAt,
        List<ResultResponse> results
) {
}
