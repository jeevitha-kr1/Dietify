package com.dietify.dietifybackend.controller;

import com.dietify.dietifybackend.dto.ProfileResponse;
import com.dietify.dietifybackend.dto.UserAnswersRequest;
import com.dietify.dietifybackend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> saveProfile(@RequestBody UserAnswersRequest req) {
        try {
            ProfileResponse res = service.save(req);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not save profile: " + e.getMessage());
        }
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}