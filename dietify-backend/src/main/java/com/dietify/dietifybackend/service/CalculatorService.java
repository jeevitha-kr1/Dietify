package com.dietify.dietifybackend.service;

import com.dietify.dietifybackend.dto.UserAnswersRequest;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public int estimateCalories(UserAnswersRequest req) {
        // Safe defaults if user skipped
        int age = req.age != null ? req.age : 22;
        int height = req.heightCm != null ? req.heightCm : 165;
        int weight = req.weightKg != null ? req.weightKg : 60;

        // Simple BMR (Mifflin-St Jeor without sex for now)
        double bmr = 10 * weight + 6.25 * height - 5 * age + 5;

        double activityMultiplier = switchSafe(req.activity,
                "Sedentary", 1.2,
                "Lightly active", 1.375,
                "Moderately active", 1.55,
                "Very active", 1.725,
                1.2
        );

        double tdee = bmr * activityMultiplier;

        // Goal adjustment
        if ("Lose fat".equalsIgnoreCase(req.goal)) tdee -= 400;
        if ("Gain muscle".equalsIgnoreCase(req.goal)) tdee += 250;

        return (int) Math.max(1200, Math.round(tdee));
    }

    public int proteinG(int calories) {
        // ~25% calories from protein => grams
        return (int) Math.round((calories * 0.25) / 4.0);
    }

    public int fatG(int calories) {
        // ~25% calories from fat => grams
        return (int) Math.round((calories * 0.25) / 9.0);
    }

    public int carbsG(int calories, int proteinG, int fatG) {
        int used = proteinG * 4 + fatG * 9;
        int remaining = Math.max(0, calories - used);
        return (int) Math.round(remaining / 4.0);
    }

    public double waterLiters(UserAnswersRequest req) {
        // Weight-based approximation
        int weight = req.weightKg != null ? req.weightKg : 60;
        return Math.round((weight * 0.035) * 10.0) / 10.0; // 0.1 rounding
    }

    private double switchSafe(String value,
                              String k1, double v1,
                              String k2, double v2,
                              String k3, double v3,
                              String k4, double v4,
                              double def) {
        if (value == null) return def;
        if (value.equalsIgnoreCase(k1)) return v1;
        if (value.equalsIgnoreCase(k2)) return v2;
        if (value.equalsIgnoreCase(k3)) return v3;
        if (value.equalsIgnoreCase(k4)) return v4;
        return def;
    }
}