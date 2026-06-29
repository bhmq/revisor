package com.revisor.api.controller;

import com.revisor.api.dto.CreateTestRequest;
import com.revisor.api.dto.RunStartResponse;
import com.revisor.api.dto.TestResponse;
import com.revisor.api.service.RunService;
import com.revisor.api.service.TestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final TestService testService;
    private final RunService runService;

    public TestController(TestService testService, RunService runService) {
        this.testService = testService;
        this.runService = runService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TestResponse create(@Valid @RequestBody CreateTestRequest request) {
        return testService.create(request);
    }

    @GetMapping
    public List<TestResponse> findAll() {
        return testService.findAll();
    }

    @GetMapping("/{id}")
    public TestResponse findById(@PathVariable Long id) {
        return testService.findById(id);
    }

    @PostMapping("/{id}/runs")
    @ResponseStatus(HttpStatus.CREATED)
    public RunStartResponse startRun(@PathVariable Long id) {
        return runService.start(id);
    }
}
