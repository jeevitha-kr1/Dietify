package com.dietify.dietifybackend.controller;

import com.dietify.dietifybackend.dto.RecipeModels.MealPlanResponse;
import com.dietify.dietifybackend.service.DeterministicRecipeEngine;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mealplan")
public class MealPlanController {
    private final DeterministicRecipeEngine engine;

    public MealPlanController(DeterministicRecipeEngine engine) {
        this.engine = engine;
    }

    @PostMapping("/generate")
    public MealPlanResponse generate(@RequestBody Map<String, Object> answers) {
        return engine.generateMealPlan(answers);
    }
}