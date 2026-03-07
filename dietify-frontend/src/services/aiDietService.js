import OpenAI from "openai";
import openai from "./openaiClient";
function buildDietPrompt(profile, metrics) {
  return `
Create a realistic and beginner-friendly personalized diet plan.

User profile:
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
    Array.isArray(profile.allergies) && profile.allergies.length > 0
      ? profile.allergies.join(", ")
      : "None"
  }
- Health Conditions: ${
    Array.isArray(profile.healthConditions) && profile.healthConditions.length > 0
      ? profile.healthConditions.join(", ")
      : "None"
  }

Calculated health metrics:
- BMI: ${metrics.bmi}
- BMI Category: ${metrics.bmiCategory}
- Recommended Daily Calories: ${metrics.calories}
- Protein: ${metrics.macros.protein} g
- Carbs: ${metrics.macros.carbs} g
- Fats: ${metrics.macros.fats} g

Return ONLY valid JSON in exactly this structure:
{
  "summary": "short paragraph",
  "mealPlan": [
    {
      "mealType": "Breakfast",
      "title": "Meal title",
      "calories": 400,
      "ingredients": ["ingredient 1", "ingredient 2"]
    }
  ],
  "tips": ["tip 1", "tip 2"],
  "recipes": [
    {
      "name": "Recipe name",
      "mealType": "Lunch",
      "calories": 550,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"]
    }
  ]
}

Rules:
- Return JSON only
- No markdown
- No explanation outside JSON
- Respect allergies and diet preference
- Keep meals practical and simple
`;
}

// Main function used by Result page
export async function generateAIMealPlan(profile, metrics) {
  try {
    // Helpful debug check
    console.log("OpenAI key exists:", !!import.meta.env.VITE_OPENAI_API_KEY);

    const prompt = buildDietPrompt(profile, metrics);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a nutrition assistant. Return only valid JSON. Do not use markdown. Do not add extra explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("OpenAI raw response object:", response);
    console.log("OpenAI output text:", response.output_text);

    return response.output_text;
  } catch (error) {
    console.error("OpenAI full error:", error);

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI status:", error.status);
      console.error("OpenAI name:", error.name);
      console.error("OpenAI message:", error.message);
      console.error("OpenAI headers:", error.headers);
    }

    throw error;
  }
}