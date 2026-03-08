import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

function buildDietPrompt(profile, metrics) {
  return `
You are a nutrition planning AI.

Create a realistic, beginner-friendly, personalized 7-day diet plan.

USER PROFILE:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Target Weight: ${profile.targetWeight} kg
- Activity Level: ${profile.activityLevel}
- Goal: ${profile.goal}
- Diet Preference: ${profile.dietPreference}
- Meals Per Day: ${profile.mealsPerDay}
- Preferred Cuisine: ${profile.preferredCuisine || "Mixed"}
- Allergies: ${
    Array.isArray(profile.allergies) && profile.allergies.length
      ? profile.allergies.join(", ")
      : "None"
  }
- Health Conditions: ${
    Array.isArray(profile.healthConditions) && profile.healthConditions.length
      ? profile.healthConditions.join(", ")
      : "None"
  }

CALCULATED METRICS:
- BMI: ${metrics?.bmi ?? "N/A"}
- Estimated Daily Calories: ${metrics?.calories ?? "N/A"}

IMPORTANT RULES:
1. Generate exactly 7 days: Monday to Sunday.
2. Respect diet preference, allergies, and health conditions.
3. Keep meals practical, affordable, and easy for beginners.
4. Use common ingredients.
5. Keep calorie estimates realistic.
6. The groceryList must contain UNIQUE ingredients only.
7. Do not repeat the same meal too often across the week.
8. Return ONLY valid JSON.
9. Do NOT include markdown, code fences, explanations, or extra text.

MEAL RULE:
- If Meals Per Day is 4 or more, include breakfast, lunch, dinner, and snack.
- If Meals Per Day is 3, include breakfast, lunch, and dinner.
- If Meals Per Day is 2, include breakfast and dinner.
- If Meals Per Day is 1, include one main meal as lunch.

EXPECTED JSON FORMAT:
{
  "days": [
    {
      "day": "Monday",
      "dailyCalories": 1600,
      "meals": {
        "breakfast": {
          "title": "Oats with banana",
          "calories": 350,
          "ingredients": ["Oats", "Banana", "Milk"]
        },
        "lunch": {
          "title": "Rice with dal",
          "calories": 500,
          "ingredients": ["Rice", "Dal", "Onion"]
        },
        "dinner": {
          "title": "Paneer salad bowl",
          "calories": 450,
          "ingredients": ["Paneer", "Tomato", "Cucumber"]
        },
        "snack": {
          "title": "Apple with peanut butter",
          "calories": 200,
          "ingredients": ["Apple", "Peanut Butter"]
        }
      }
    }
  ],
  "groceryList": ["Oats", "Banana", "Milk"],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
`;
}

function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI response did not contain valid JSON.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function dedupeAndNormalizeGroceryList(groceryList) {
  if (!Array.isArray(groceryList)) return [];

  const seen = new Set();

  return groceryList
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function validateMealPlanShape(data) {
  if (!data || typeof data !== "object") {
    throw new Error("AI returned invalid data.");
  }

  if (!Array.isArray(data.days) || data.days.length !== 7) {
    throw new Error("AI response must contain exactly 7 days.");
  }

  if (!Array.isArray(data.tips) || data.tips.length === 0) {
    throw new Error("AI response must contain health tips.");
  }

  if (!Array.isArray(data.groceryList)) {
    data.groceryList = [];
  }

  return data;
}

export async function generateAIMealPlan(profile, metrics) {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env");
  }

  const prompt = buildDietPrompt(profile, metrics);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";

    console.log("RAW GEMINI RESPONSE:", text);

    const jsonText = extractJson(text);

    console.log("CLEANED GEMINI RESPONSE:", jsonText);

    const parsed = JSON.parse(jsonText);

    parsed.groceryList = dedupeAndNormalizeGroceryList(parsed.groceryList);

    validateMealPlanShape(parsed);

    console.log("PARSED GEMINI RESPONSE:", parsed);

    return parsed;
  } catch (error) {
    console.error("Gemini meal plan generation failed:", error);
    throw new Error(
      "We could not generate your meal plan right now. Please try again."
    );
  }
}