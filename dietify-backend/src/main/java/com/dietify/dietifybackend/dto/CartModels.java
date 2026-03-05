package com.dietify.dietifybackend.dto;

import java.util.ArrayList;
import java.util.List;

public class CartModels {

    // Request: send the meal plan back to backend to extract ingredients
    public static class CartFromPlanRequest {
        public List<MealDay> days = new ArrayList<>();
    }

    public static class MealDay {
        public String date;                 // "2026-03-05"
        public List<MealItem> meals = new ArrayList<>();
    }

    public static class MealItem {
        public String mealType;             // "Breakfast", "Lunch"
        public String recipeId;             // optional
        public String title;                // "Lentil Soup"
        public List<IngredientLine> ingredients = new ArrayList<>();
    }

    public static class IngredientLine {
        public String name;                 // "Lentils"
        public double qty;                  // 200
        public String unit;                 // "g", "ml", "pcs"
    }

    // Response: aggregated cart items
    public static class CartResponse {
        public List<CartItem> items = new ArrayList<>();
        public int totalUniqueItems;
    }

    public static class CartItem {
        public String name;
        public double qty;
        public String unit;

        public CartItem() {}
        public CartItem(String name, double qty, String unit) {
            this.name = name;
            this.qty = qty;
            this.unit = unit;
        }
    }
}