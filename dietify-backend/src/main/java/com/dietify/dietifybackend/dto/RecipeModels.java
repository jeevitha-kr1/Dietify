package com.dietify.dietifybackend.dto;

import java.util.List;

public class RecipeModels {

    // ===== Recipe =====
    public static class Recipe {
        public String id;
        public String title;
        public List<Ingredient> ingredients;
        public List<String> steps;
        public List<String> tags;
        public Nutrition nutrition;
    }

    public static class Ingredient {
        public String name;
        public String qty;

        public Ingredient() {}
        public Ingredient(String name, String qty) {
            this.name = name;
            this.qty = qty;
        }
    }

    public static class Nutrition {
        public int calories;
        public int proteinG;
        public int carbsG;
        public int fatG;
    }

    // ===== Meal Plan =====
    public static class MealPlanMeal {
        public String mealType;
        public Recipe recipe;
    }

    public static class MealPlanDay {
        public String date;
        public List<MealPlanMeal> meals;
    }

    public static class MealPlanResponse {
        public int mealsPerDay;
        public int dailyTargetCalories;
        public List<MealPlanDay> days;
    }
}