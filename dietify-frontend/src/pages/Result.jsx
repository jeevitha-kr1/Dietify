import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { generateAIMealPlan } from "../services/aiDietService";
import { setAiData, setAiLoading } from "../store/slices/aiSlice";
import { addToCart } from "../store/slices/cartSlice";

import "../styles/Result.css";

export default function Result() {
  const dispatch = useDispatch();

  // Read stored data from Redux
  const profile = useSelector((state) => state.user.profile);
  const results = useSelector((state) => state.result);
  const aiData = useSelector((state) => state.ai);

  const [error, setError] = useState("");

  // Load AI meal plan when page loads
  useEffect(() => {
    async function fetchMealPlan() {
      try {
        dispatch(setAiLoading(true));

        const aiResponse = await generateAIMealPlan(profile, results);

        const parsedData = safelyParseAI(aiResponse);

        dispatch(setAiData(parsedData));
      } catch (err) {
        console.error("Failed to load AI meal plan:", err);

        // Show readable message on UI
        setError("OpenAI quota exceeded. Showing demo meal plan instead.");

        // Fallback demo data so the project still works even if API fails
        dispatch(
          setAiData({
            summary:
              "Based on your profile, a balanced routine with structured meals, enough protein, moderate carbohydrates, and healthy fats would support your goal well.",
            mealPlan: [
              {
                mealType: "Breakfast",
                title: "Oats with banana and almonds",
                calories: 350,
                ingredients: ["Oats", "Banana", "Milk", "Almonds"],
              },
              {
                mealType: "Lunch",
                title: "Rice with dal and mixed vegetables",
                calories: 550,
                ingredients: ["Rice", "Dal", "Carrot", "Beans", "Onion"],
              },
              {
                mealType: "Dinner",
                title: "Paneer salad bowl",
                calories: 420,
                ingredients: ["Paneer", "Cucumber", "Tomato", "Lettuce"],
              },
            ],
            recipes: [
              {
                name: "Vegetable Rice Bowl",
                mealType: "Lunch",
                calories: 500,
                ingredients: ["Rice", "Paneer", "Capsicum", "Onion"],
                instructions: [
                  "Cook the rice until soft.",
                  "Saute onion, capsicum, and paneer.",
                  "Combine everything and serve warm.",
                ],
              },
              {
                name: "Protein Oats Bowl",
                mealType: "Breakfast",
                calories: 320,
                ingredients: ["Oats", "Milk", "Banana", "Peanut Butter"],
                instructions: [
                  "Cook oats with milk.",
                  "Top with sliced banana.",
                  "Add peanut butter before serving.",
                ],
              },
            ],
            tips: [
              "Include protein in each main meal.",
              "Drink water consistently through the day.",
              "Keep meal timings regular.",
            ],
          })
        );
      } finally {
        dispatch(setAiLoading(false));
      }
    }

    // Only fetch if not already loaded
    if (!aiData.summary) {
      fetchMealPlan();
    }
  }, [dispatch, profile, results, aiData.summary]);

  // Convert AI text into JSON safely
  function safelyParseAI(text) {
    try {
      return JSON.parse(text);
    } catch {
      return {
        summary: "AI response could not be parsed.",
        mealPlan: [],
        recipes: [],
        tips: [],
      };
    }
  }

  // Convert recipe ingredients into cart items
  function convertIngredients(ingredients = []) {
    return ingredients.map((ingredient, index) => ({
      id: `${ingredient}-${index}`,
      name: ingredient,
      quantity: 1,
      unit: "item",
    }));
  }

  function handleAddToCart(recipe) {
    const ingredients = convertIngredients(recipe.ingredients || []);
    dispatch(addToCart(ingredients));
  }

  return (
    <main className="result-page">
      <section className="result-card">
        <h1>Your Dietify Results</h1>

        {/* Health Metrics */}
        <div className="metrics-grid">
          <div className="metric">
            <h3>BMI</h3>
            <p>{results.bmi}</p>
            <span>{results.bmiCategory}</span>
          </div>

          <div className="metric">
            <h3>Calories</h3>
            <p>{results.calories}</p>
            <span>per day</span>
          </div>

          <div className="metric">
            <h3>Protein</h3>
            <p>{results.macros.protein} g</p>
          </div>

          <div className="metric">
            <h3>Carbs</h3>
            <p>{results.macros.carbs} g</p>
          </div>

          <div className="metric">
            <h3>Fats</h3>
            <p>{results.macros.fats} g</p>
          </div>
        </div>

        {/* AI Summary */}
        <section className="ai-summary">
          <h2>AI Nutrition Summary</h2>

          {aiData.loading ? (
            <p>Generating personalized plan...</p>
          ) : (
            <p>{aiData.summary || "Your AI summary will appear here."}</p>
          )}
        </section>

        {/* Meal Plan */}
        {aiData.mealPlan?.length > 0 ? (
          <section className="meal-plan">
            <h2>Suggested Meal Plan</h2>

            <div className="meal-grid">
              {aiData.mealPlan.map((meal, index) => (
                <div key={index} className="meal-card">
                  <h3>{meal.mealType}</h3>
                  <p>{meal.title}</p>
                  <span>{meal.calories} kcal</span>

                  {meal.ingredients?.length > 0 ? (
                    <ul>
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="meal-plan">
            <h2>Suggested Meal Plan</h2>
            <p>No meal plan available yet.</p>
          </section>
        )}

        {/* Recipes */}
        {aiData.recipes?.length > 0 ? (
          <section className="recipes">
            <h2>Recommended Recipes</h2>

            <div className="recipe-grid">
              {aiData.recipes.map((recipe, index) => (
                <div key={index} className="recipe-card">
                  <h3>{recipe.name}</h3>
                  <p>{recipe.calories} kcal</p>

                  <ul>
                    {recipe.ingredients?.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => handleAddToCart(recipe)}
                  >
                    Add Ingredients to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="recipes">
            <h2>Recommended Recipes</h2>
            <p>No recipes available yet.</p>
          </section>
        )}

        {/* Tips */}
        {aiData.tips?.length > 0 ? (
          <section className="tips">
            <h2>Helpful Tips</h2>

            <ul>
              {aiData.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="tips">
            <h2>Helpful Tips</h2>
            <p>No additional tips available yet.</p>
          </section>
        )}

        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}