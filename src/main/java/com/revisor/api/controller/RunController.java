package com.revisor.api.controller;

import com.revisor.api.dto.RunResponse;
import com.revisor.api.service.RunService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/runs")
public class RunController {

    private final RunService runService;

    public RunController(RunService runService) {
        this.runService = runService;
    }

    @GetMapping("/{id}")
    public RunResponse findById(@PathVariable Long id) {
        return runService.findById(id);
    }
}
