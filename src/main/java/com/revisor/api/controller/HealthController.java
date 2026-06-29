package com.revisor.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "OK");
    }

    @GetMapping("/about")
    public Map<String, String> about() {
        return Map.of("name: ", "Revisor", "version: ", "1.0");
    }
}