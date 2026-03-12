import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateAIMealPlan } from "../services/aiDietService";
import { setAiData, setAiLoading } from "../store/slices/aiSlice";
import { addToCart } from "../store/slices/cartSlice";
import "../styles/Result.css";

const FALLBACK_AI_DATA = {
  summary:
    "Based on your profile, this weekly plan focuses on balanced nutrition, practical meals, and consistent eating habits.",
  weeklyPlan: [
    {
      day: "Monday",
      dailyCalories: 1520,
      meals: [
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
        {
          mealType: "Snack",
          title: "Apple with peanut butter",
          calories: 200,
          ingredients: ["Apple", "Peanut Butter"],
        },
      ],
    },
  ],
  tips: [
    "Include protein in each main meal.",
    "Drink water consistently through the day.",
    "Keep meal timings regular.",
  ],
  groceryList: [],
};

function transformAIResponse(data) {
  const sourceDays = Array.isArray(data?.days) ? data.days : [];

  if (sourceDays.length === 0) {
    return {
      summary: "Your personalized weekly meal plan is ready.",
      weeklyPlan: [],
      tips: Array.isArray(data?.tips) ? data.tips : [],
      groceryList: Array.isArray(data?.groceryList) ? data.groceryList : [],
    };
  }

  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];

  const weeklyPlan = sourceDays.map((dayObj) => {
    const mealsObject = dayObj?.meals || {};

    const meals = mealOrder
      .filter((key) => mealsObject[key]?.title)
      .map((key) => ({
        mealType: key.charAt(0).toUpperCase() + key.slice(1),
        title: mealsObject[key]?.title || "",
        calories: mealsObject[key]?.calories || "",
        ingredients: Array.isArray(mealsObject[key]?.ingredients)
          ? mealsObject[key].ingredients
          : [],
      }));

    return {
      day: dayObj.day || "Day",
      dailyCalories: dayObj.dailyCalories || "N/A",
      meals,
    };
  });

  return {
    summary:
      "Here is your AI-generated 7-day meal plan based on your profile and goals.",
    weeklyPlan,
    tips: Array.isArray(data?.tips) ? data.tips : [],
    groceryList: Array.isArray(data?.groceryList) ? data.groceryList : [],
  };
}

export default function Result() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.user.profile);
  const results = useSelector((state) => state.result);
  const aiData = useSelector((state) => state.ai);
  const cartItems = useSelector((state) => state.cart.items);

  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState("Monday");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function fetchMealPlan() {
      try {
        dispatch(setAiLoading(true));
        setError("");

        const aiResponse = await generateAIMealPlan(profile, results);
        const transformed = transformAIResponse(aiResponse);

        dispatch(setAiData(transformed));
      } catch (err) {
        console.error("Failed to load AI meal plan:", err);
        setError("AI is temporarily unavailable. Showing a demo meal plan instead.");
        dispatch(setAiData(FALLBACK_AI_DATA));
      } finally {
        dispatch(setAiLoading(false));
      }
    }

    const hasProfile =
      profile &&
      Object.keys(profile).length > 0 &&
      profile.age &&
      profile.height &&
      profile.weight;

    if (!hasProfile) {
      navigate("/user-input");
      return;
    }

    if (!aiData.weeklyPlan || aiData.weeklyPlan.length === 0) {
      fetchMealPlan();
    }
  }, [dispatch, navigate, profile, results, aiData.weeklyPlan]);

  useEffect(() => {
    if (!cartMessage) return;

    const timer = setTimeout(() => {
      setCartMessage("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [cartMessage]);

  const days = useMemo(() => {
    return aiData.weeklyPlan?.map((item) => item.day) || [];
  }, [aiData.weeklyPlan]);

  const selectedDayData = useMemo(() => {
    return aiData.weeklyPlan?.find((item) => item.day === activeDay) || null;
  }, [aiData.weeklyPlan, activeDay]);

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    if (days.length > 0 && !days.includes(activeDay)) {
      setActiveDay(days[0]);
    }
  }, [days, activeDay]);

  function convertIngredients(ingredients = []) {
    return ingredients.map((ingredient, index) => ({
      id: `${ingredient}-${index}`,
      name: ingredient,
      quantity: 1,
      unit: "item",
    }));
  }

  function handleAddMealIngredients(meal) {
    const items = convertIngredients(meal.ingredients || []);

    if (items.length > 0) {
      dispatch(addToCart(items));
      setCartMessage(`${meal.mealType} ingredients added to cart`);
    }
  }

  function handleBackToUserInput() {
    navigate("/user-input");
  }

  return (
    <main className="result-page">
      <section className="page-shell result-shell">
        <section className="result-card glass-card">
          <div className="result-topbar">
            <div className="result-topbar-copy">
              <p className="result-kicker">Dietify Results</p>
              <h1>Your personalized nutrition plan</h1>
              <p className="result-subtitle">
                Explore your AI-powered weekly meal plan, nutrition metrics, and
                shopping-ready ingredients.
              </p>
            </div>

            <div className="result-topbar-actions">
              <button
                type="button"
                className="result-top-action"
                onClick={() => navigate("/cart")}
              >
                View Cart ({totalCartItems})
              </button>

              <button
                type="button"
                className="result-top-action"
                onClick={handleBackToUserInput}
              >
                Back
              </button>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <h3>BMI</h3>
              <p>{results.bmi || "—"}</p>
              <span>{results.bmiCategory || "No category"}</span>
            </div>

            <div className="metric-card">
              <h3>Calories</h3>
              <p>{results.calories || "—"}</p>
              <span>per day</span>
            </div>

            <div className="metric-card">
              <h3>Protein</h3>
              <p>{results.macros?.protein ?? "—"} g</p>
            </div>

            <div className="metric-card">
              <h3>Carbs</h3>
              <p>{results.macros?.carbs ?? "—"} g</p>
            </div>

            <div className="metric-card">
              <h3>Fats</h3>
              <p>{results.macros?.fats ?? "—"} g</p>
            </div>
          </div>

          <section className="result-section">
            <h2>AI Nutrition Summary</h2>
            {aiData.loading ? (
              <p className="result-loading">Generating your personalized plan...</p>
            ) : (
              <p>{aiData.summary || "Your AI summary will appear here."}</p>
            )}
          </section>

          {cartMessage ? <div className="cart-toast">{cartMessage}</div> : null}

          <section className="result-section">
            <div className="section-header">
              <div>
                <h2>Weekly Meal Plan</h2>
                <p>Select a day to explore meals and add ingredients to cart.</p>
              </div>
            </div>

            {days.length > 0 ? (
              <>
                <div className="day-tabs">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`day-tab ${activeDay === day ? "active" : ""}`}
                      onClick={() => setActiveDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {selectedDayData ? (
                  <div className="day-panel glass-panel">
                    <div className="day-panel-header">
                      <div>
                        <h3>{selectedDayData.day}</h3>
                        <p>Daily target: {selectedDayData.dailyCalories} kcal</p>
                      </div>
                    </div>

                    <div className="meal-grid">
                      {selectedDayData.meals.length > 0 ? (
                        selectedDayData.meals.map((meal, index) => (
                          <article key={`${meal.mealType}-${index}`} className="meal-card">
                            <div className="meal-card-top">
                              <span className="meal-badge">{meal.mealType}</span>
                              <span className="meal-calories">
                                {meal.calories || "—"} kcal
                              </span>
                            </div>

                            <h3>{meal.title}</h3>

                            {meal.ingredients?.length > 0 ? (
                              <>
                                <p className="ingredient-title">Ingredients</p>
                                <ul className="ingredient-list">
                                  {meal.ingredients.map((ingredient, i) => (
                                    <li key={`${ingredient}-${i}`}>{ingredient}</li>
                                  ))}
                                </ul>

                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => handleAddMealIngredients(meal)}
                                >
                                  Add Ingredients to Cart
                                </button>
                              </>
                            ) : (
                              <p>No ingredient details available.</p>
                            )}
                          </article>
                        ))
                      ) : (
                        <p>No meals available for this day.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <p>No weekly meal plan available yet.</p>
            )}
          </section>

          <section className="result-section result-cart-section">
            <div className="result-cart-cta-wrap">
              <button
                type="button"
                className="result-cart-cta"
                onClick={() => navigate("/cart")}
              >
                Open Shopping Cart
              </button>
            </div>
          </section>

          <section className="result-section">
            <h2>Helpful Tips</h2>
            {aiData.tips?.length > 0 ? (
              <ul className="tips-list">
                {aiData.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            ) : (
              <p>No additional tips available yet.</p>
            )}
          </section>

          {error ? <p className="error">{error}</p> : null}
        </section>
      </section>
    </main>
  );
}