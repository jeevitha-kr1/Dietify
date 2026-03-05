package com.dietify.dietifybackend.service;

import com.dietify.dietifybackend.dto.ProfileResponse;
import com.dietify.dietifybackend.dto.UserAnswersRequest;
import com.dietify.dietifybackend.model.UserProfile;
import com.dietify.dietifybackend.repository.UserProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ProfileService {

    private final UserProfileRepository repo;
    private final CalculatorService calculator;
    private final ObjectMapper mapper;

    public ProfileService(UserProfileRepository repo, CalculatorService calculator, ObjectMapper mapper) {
        this.repo = repo;
        this.calculator = calculator;
        this.mapper = mapper;
    }

    public ProfileResponse save(UserAnswersRequest req) throws Exception {
        int calories = calculator.estimateCalories(req);
        int protein = calculator.proteinG(calories);
        int fat = calculator.fatG(calories);
        int carbs = calculator.carbsG(calories, protein, fat);
        double water = calculator.waterLiters(req);

        // Save answers JSON
        String json = mapper.writeValueAsString(req);

        UserProfile profile = new UserProfile();
        profile.setAnswersJson(json);
        profile.setDailyCalories(calories);
        profile.setProteinG(protein);
        profile.setFatG(fat);
        profile.setCarbsG(carbs);
        profile.setWaterLiters(water);

        profile = repo.save(profile);

        ProfileResponse res = new ProfileResponse();
        res.profileId = profile.getId();

        Map<String, Object> saved = new LinkedHashMap<>();
        saved.put("goal", req.goal);
        saved.put("dietType", req.dietType);
        saved.put("allergies", req.allergies);
        saved.put("conditions", req.conditions);
        saved.put("age", req.age);
        saved.put("heightCm", req.heightCm);
        saved.put("weightKg", req.weightKg);
        saved.put("activity", req.activity);
        saved.put("steps", req.steps);
        saved.put("sleep", req.sleep);
        saved.put("water", req.water);

        res.savedAnswers = saved;
        res.dailyCalories = calories;
        res.proteinG = protein;
        res.carbsG = carbs;
        res.fatG = fat;
        res.waterLiters = water;

        return res;
    }
}