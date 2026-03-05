package com.dietify.dietifybackend.service;

import com.dietify.dietifybackend.dto.CartModels;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CartService {

    public CartModels.CartResponse buildFromPlan(CartModels.CartFromPlanRequest req) {
        // key: "name|unit"
        Map<String, CartModels.CartItem> merged = new LinkedHashMap<>();

        if (req == null || req.days == null) {
            CartModels.CartResponse empty = new CartModels.CartResponse();
            empty.totalUniqueItems = 0;
            return empty;
        }

        for (CartModels.MealDay day : req.days) {
            if (day == null || day.meals == null) continue;

            for (CartModels.MealItem meal : day.meals) {
                if (meal == null || meal.ingredients == null) continue;

                for (CartModels.IngredientLine ing : meal.ingredients) {
                    if (ing == null) continue;

                    String name = safe(ing.name);
                    String unit = safe(ing.unit);
                    double qty = ing.qty;

                    if (name.isBlank()) continue;
                    if (unit.isBlank()) unit = "unit"; // fallback

                    String key = (name.toLowerCase() + "|" + unit.toLowerCase());

                    if (!merged.containsKey(key)) {
                        merged.put(key, new CartModels.CartItem(name, qty, unit));
                    } else {
                        CartModels.CartItem existing = merged.get(key);
                        existing.qty = existing.qty + qty;
                    }
                }
            }
        }

        CartModels.CartResponse res = new CartModels.CartResponse();
        res.items.addAll(merged.values());
        res.totalUniqueItems = res.items.size();
        return res;
    }

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }
}