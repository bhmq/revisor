package com.revisor.api.dto;

import java.util.List;

public record TestResponse(
        Long id,
        String name,
        String description,
        List<TestUrlResponse> urls
) {
}
