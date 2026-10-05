package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Basic Health Check Controller to verify backend startup and database readiness.
 * 
 * INTERVIEW NOTE:
 * @RestController is a specialized version of @Controller. It combines @Controller and @ResponseBody,
 * meaning methods automatically serialize return objects into JSON/XML HTTP response bodies.
 * 
 * @RequestMapping defines the base URL path mapping for all handler methods in this controller.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * GET /api/health
     * Returns application health status.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "CartPulse Backend is running successfully!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
