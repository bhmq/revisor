package com.revisor.api.service;

import com.revisor.api.model.Result;
import com.revisor.api.model.ResultStatus;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;

@Service
public class UrlCheckService {

    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(TIMEOUT)
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public Result check(String url) {
        Result result = new Result();
        result.setUrl(url);
        result.setCheckedAt(Instant.now());

        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .timeout(TIMEOUT)
                    .GET()
                    .build();
            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            int httpCode = response.statusCode();
            result.setHttpCode(httpCode);
            result.setStatus(httpCode >= 200 && httpCode < 400 ? ResultStatus.OK : ResultStatus.HTTP_ERROR);
        } catch (Exception exception) {
            result.setStatus(ResultStatus.FAILED);
            result.setErrorMessage(errorMessage(exception));
        }

        return result;
    }

    private String errorMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? exception.getClass().getSimpleName() : message;
    }
}
