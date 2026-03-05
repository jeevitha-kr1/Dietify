package com.dietify.dietifybackend.controller;

import com.dietify.dietifybackend.dto.RecipeModels.Recipe;
import com.dietify.dietifybackend.service.DeterministicRecipeEngine;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final DeterministicRecipeEngine engine;

    public RecipeController(DeterministicRecipeEngine engine) {
        this.engine = engine;
    }

    @PostMapping("/generate")
    public List<Recipe> generate(@RequestBody Map<String, Object> answers) {
        return engine.generateRecipes(answers);
    }
}