import { useLocation } from "react-router-dom";
import "../styles/Result.css";

function Result() {
  const location = useLocation();
  const userData = location.state;

  if (!userData) {
    return <p>No data found. Please fill the form.</p>;
  }

  function calculateBMR(data) {
    if (data.gender === "Male") {
      return 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      return 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }
  }

  function calculateCalories(bmr, activity, goal) {
    const activityMap = { Low: 1.2, Moderate: 1.55, High: 1.725 };
    let calories = bmr * (activityMap[activity] || 1.2);
    if (goal === "Lose") calories -= 400;
    if (goal === "Gain") calories += 400;
    return Math.round(calories);
  }

  function calculateMacros(calories) {
    return {
      protein: Math.round((calories * 0.3) / 4),
      carbs: Math.round((calories * 0.4) / 4),
      fats: Math.round((calories * 0.3) / 9)
    };
  }

  const bmr = calculateBMR(userData);
  const calories = calculateCalories(bmr, userData.activity, userData.goal);
  const macros = calculateMacros(calories);

  function getMealPlan(diet) {
    if (diet === "Veg") {
      return {
        breakfast: "Oats with fruits and nuts",
        lunch: "Rice, dal, vegetables, curd",
        dinner: "Roti with paneer and salad"
      };
    } else {
      return {
        breakfast: "Egg omelette with toast",
        lunch: "Rice, chicken curry, vegetables",
        dinner: "Grilled chicken with salad"
      };
    }
  }

  const mealPlan = getMealPlan(userData.diet);

  return (
    <div className="result-page">
      <div className="result-card">
        <h1 className="result-title">Your Personalized Diet Plan</h1>

        <div className="result-highlight">
          <h2>Daily Calorie Target</h2>
          <p className="result-big-number">{calories} kcal</p>
        </div>

        <div className="result-section">
          <h2>Macronutrient Split</h2>
          <div className="result-macro-grid">
            <div className="result-macro">
              Protein<br /><strong>{macros.protein} g</strong>
            </div>
            <div className="result-macro">
              Carbs<br /><strong>{macros.carbs} g</strong>
            </div>
            <div className="result-macro">
              Fats<br /><strong>{macros.fats} g</strong>
            </div>
          </div>
        </div>

        <div className="result-section">
          <h2>Sample Meal Plan</h2>
          <ul className="result-meal-list">
            <li><strong>Breakfast:</strong> {mealPlan.breakfast}</li>
            <li><strong>Lunch:</strong> {mealPlan.lunch}</li>
            <li><strong>Dinner:</strong> {mealPlan.dinner}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Result;