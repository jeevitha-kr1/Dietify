package com.dietify.dietifybackend.service;

import com.dietify.dietifybackend.dto.RecipeModels.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DeterministicRecipeEngine {

    /* ======================================================
       PUBLIC METHODS
    ====================================================== */

    public List<Recipe> generateRecipes(Map<String, Object> answers) {

        Prefs prefs = Prefs.from(answers);

        List<RecipeTemplate> templates = templates();

        List<RecipeTemplate> filtered = new ArrayList<>();

        for (RecipeTemplate t : templates) {
            if (t.isCompatible(prefs)) {
                filtered.add(t);
            }
        }

        filtered.sort(Comparator.comparingInt(t -> stableScore(t.id, prefs.seed)));

        List<Recipe> result = new ArrayList<>();

        int count = Math.min(6, filtered.size());

        for (int i = 0; i < count; i++) {
            result.add(filtered.get(i).toRecipe(prefs));
        }

        return result;
    }


    public MealPlanResponse generateMealPlan(Map<String, Object> answers) {

        Prefs prefs = Prefs.from(answers);

        List<Recipe> recipes = generateRecipes(answers);

        if (recipes.isEmpty()) {
            recipes.add(fallbackRecipe());
        }

        int mealsPerDay = clampMealsPerDay(prefs.mealsPerDay);

        List<String> mealTypes = mealTypesFor(mealsPerDay);

        List<MealPlanDay> days = new ArrayList<>();

        LocalDate start = LocalDate.now();

        for (int d = 0; d < 7; d++) {

            MealPlanDay day = new MealPlanDay();

            day.date = start.plusDays(d).toString();

            List<MealPlanMeal> meals = new ArrayList<>();

            for (int m = 0; m < mealTypes.size(); m++) {

                int idx = stableScore("day" + d + "meal" + m, prefs.seed) % recipes.size();

                MealPlanMeal meal = new MealPlanMeal();

                meal.mealType = mealTypes.get(m);

                meal.recipe = recipes.get(idx);

                meals.add(meal);
            }

            day.meals = meals;

            days.add(day);
        }

        MealPlanResponse res = new MealPlanResponse();

        res.mealsPerDay = mealsPerDay;

        res.dailyTargetCalories = estimateDailyCalories(prefs);

        res.days = days;

        return res;
    }


    /* ======================================================
       RECIPE TEMPLATE
    ====================================================== */

    private static class RecipeTemplate {

        String id;
        String title;

        List<Ingredient> ingredients;
        List<String> steps;
        List<String> tags;

        boolean vegan;
        boolean vegetarian;

        boolean containsEgg;
        boolean containsMilk;
        boolean containsPeanut;
        boolean containsTreeNuts;
        boolean containsGluten;
        boolean containsSoy;
        boolean containsFish;
        boolean containsShellfish;

        int baseCalories;
        int baseProtein;
        int baseCarbs;
        int baseFat;


        boolean isCompatible(Prefs p) {

            if ("Vegan".equalsIgnoreCase(p.dietType) && !vegan) return false;

            if ("Vegetarian".equalsIgnoreCase(p.dietType) && !vegetarian) return false;

            if (p.allergies.contains("Egg") && containsEgg) return false;

            if (p.allergies.contains("Milk") && containsMilk) return false;

            if (p.allergies.contains("Peanuts") && containsPeanut) return false;

            if (p.allergies.contains("Tree nuts") && containsTreeNuts) return false;

            if (p.allergies.contains("Wheat/Gluten") && containsGluten) return false;

            if (p.allergies.contains("Soy") && containsSoy) return false;

            if (p.allergies.contains("Fish") && containsFish) return false;

            if (p.allergies.contains("Shellfish") && containsShellfish) return false;

            return true;
        }


        Recipe toRecipe(Prefs p) {

            Recipe r = new Recipe();

            r.id = id;

            r.title = title;

            r.ingredients = ingredients;

            r.steps = steps;

            r.tags = new ArrayList<>(tags);

            Nutrition n = new Nutrition();

            int cal = baseCalories + goalDelta(p) + activityDelta(p);

            int protein = baseProtein;

            int fat = baseFat;

            int carbs = baseCarbs;

            n.calories = cal;
            n.proteinG = protein;
            n.fatG = fat;
            n.carbsG = carbs;

            r.nutrition = n;

            return r;
        }
    }


    /* ======================================================
       USER PREFERENCES
    ====================================================== */

    private static class Prefs {

        String goal;
        String dietType;
        String activity;

        int age;
        int heightCm;
        int weightKg;

        int mealsPerDay;

        Set<String> allergies;
        Set<String> conditions;

        String seed;

        static Prefs from(Map<String, Object> a) {

            Prefs p = new Prefs();

            p.goal = str(a.get("goal"), "Maintain");

            p.dietType = str(a.get("dietType"), "No preference");

            p.activity = str(a.get("activity"), "Lightly active");

            p.age = num(a.get("age"), 25);

            p.heightCm = num(a.get("heightCm"), 170);

            p.weightKg = num(a.get("weightKg"), 65);

            p.mealsPerDay = parseMealsPerDay(str(a.get("mealsPerDay"), "3"));

            p.allergies = toSet(a.get("allergies"));

            p.conditions = toSet(a.get("conditions"));

            p.seed = p.goal + "|" + p.dietType + "|" + p.age + "|" + p.weightKg;

            return p;
        }
    }


    /* ======================================================
       TEMPLATE RECIPES
    ====================================================== */

    private List<RecipeTemplate> templates() {

        List<RecipeTemplate> list = new ArrayList<>();

        list.add(template(
                "veg_bowl",
                "Veggie Protein Bowl",
                List.of(new Ingredient("Chickpeas", "1 cup"),
                        new Ingredient("Brown Rice", "1 cup")),
                List.of("Cook rice", "Mix chickpeas", "Combine"),
                List.of("Vegan"),
                true, true,
                false,false,false,false,false,false,false,false,
                520,22,70,14
        ));

        list.add(template(
                "lentil_soup",
                "Lentil Soup",
                List.of(new Ingredient("Lentils","1 cup"),
                        new Ingredient("Carrot","1")),
                List.of("Boil lentils","Add vegetables"),
                List.of("Vegan"),
                true,true,
                false,false,false,false,false,false,false,false,
                480,24,60,10
        ));

        list.add(template(
                "paneer_masala",
                "Paneer Masala",
                List.of(new Ingredient("Paneer","150g"),
                        new Ingredient("Tomato","2")),
                List.of("Cook onion","Add paneer"),
                List.of("Vegetarian"),
                false,true,
                false,true,false,false,false,false,false,false,
                560,30,35,24
        ));

        return list;
    }


    /* ======================================================
       TEMPLATE CREATOR
    ====================================================== */

    private RecipeTemplate template(
            String id,
            String title,
            List<Ingredient> ingredients,
            List<String> steps,
            List<String> tags,
            boolean vegan,
            boolean vegetarian,
            boolean containsEgg,
            boolean containsMilk,
            boolean containsPeanut,
            boolean containsTreeNuts,
            boolean containsGluten,
            boolean containsSoy,
            boolean containsFish,
            boolean containsShellfish,
            int baseCalories,
            int baseProtein,
            int baseCarbs,
            int baseFat
    ) {

        RecipeTemplate t = new RecipeTemplate();

        t.id = id;
        t.title = title;
        t.ingredients = ingredients;
        t.steps = steps;
        t.tags = tags;

        t.vegan = vegan;
        t.vegetarian = vegetarian;

        t.containsEgg = containsEgg;
        t.containsMilk = containsMilk;
        t.containsPeanut = containsPeanut;
        t.containsTreeNuts = containsTreeNuts;
        t.containsGluten = containsGluten;
        t.containsSoy = containsSoy;
        t.containsFish = containsFish;
        t.containsShellfish = containsShellfish;

        t.baseCalories = baseCalories;
        t.baseProtein = baseProtein;
        t.baseCarbs = baseCarbs;
        t.baseFat = baseFat;

        return t;
    }


    /* ======================================================
       UTILITIES
    ====================================================== */

    private int stableScore(String key, String seed) {

        String s = key + seed;

        int h = 0;

        for (int i = 0; i < s.length(); i++) {
            h = 31 * h + s.charAt(i);
        }

        return Math.abs(h);
    }


    private static int parseMealsPerDay(String s) {
        try {
            return Integer.parseInt(s.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 3;
        }
    }


    private static int clampMealsPerDay(int m) {

        if (m < 2) return 2;

        if (m > 5) return 5;

        return m;
    }


    private static List<String> mealTypesFor(int meals) {

        if (meals == 2) return List.of("Lunch","Dinner");

        if (meals == 3) return List.of("Breakfast","Lunch","Dinner");

        if (meals == 4) return List.of("Breakfast","Lunch","Snack","Dinner");

        return List.of("Breakfast","Lunch","Snack","Dinner","Snack 2");
    }


    private static int estimateDailyCalories(Prefs p) {

        int base = 22 * p.weightKg;

        base += (p.heightCm - 160) * 2;

        return Math.max(1400, Math.min(base, 3000));
    }


    private static int activityDelta(Prefs p) {

        if (p.activity.contains("Very")) return 120;

        if (p.activity.contains("Moderately")) return 80;

        if (p.activity.contains("Lightly")) return 40;

        return 0;
    }


    private static int goalDelta(Prefs p) {

        if (p.goal.contains("Lose")) return -80;

        if (p.goal.contains("Gain")) return 120;

        return 0;
    }


    private static Recipe fallbackRecipe() {

        Recipe r = new Recipe();

        r.id = "fallback";

        r.title = "Rice & Vegetables";

        r.ingredients = List.of(
                new Ingredient("Rice","1 cup"),
                new Ingredient("Mixed vegetables","1 cup")
        );

        r.steps = List.of(
                "Cook rice",
                "Add vegetables"
        );

        Nutrition n = new Nutrition();

        n.calories = 450;
        n.proteinG = 15;
        n.carbsG = 70;
        n.fatG = 8;

        r.nutrition = n;

        return r;
    }


    private static String str(Object o, String d) {

        if (o == null) return d;

        return String.valueOf(o);
    }


    private static int num(Object o, int d) {

        try {
            return Integer.parseInt(String.valueOf(o));
        } catch (Exception e) {
            return d;
        }
    }


    private static Set<String> toSet(Object o) {

        Set<String> s = new HashSet<>();

        if (o instanceof List<?>) {
            for (Object x : (List<?>) o) {
                s.add(String.valueOf(x));
            }
        }

        return s;
    }
}