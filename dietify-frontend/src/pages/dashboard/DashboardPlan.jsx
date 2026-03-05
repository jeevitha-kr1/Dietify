import { useState } from "react";
import { generateMealPlan } from "../../api/mealplan";
import { cartFromMealPlan } from "../../api/cart";

const INPUT_KEY = "dietify_user_inputs_v1";

function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(INPUT_KEY) || "{}")?.answers || {};
  } catch {
    return {};
  }
}

export default function DashboardPlan() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");

  const run = async () => {
    try {
      setErr("");
      setLoading(true);
      const answers = getAnswers();
      const data = await generateMealPlan(answers);
      setPlan(data);
      setCart(null);
    } catch (e) {
      setErr(e.message || "Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  const buildCart = async () => {
    if (!plan) return;
    try {
      const data = await cartFromMealPlan(plan);
      setCart(data);
    } catch (e) {
      setErr(e.message || "Failed to generate cart");
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <h1 className="dash-h1">Meal Plan</h1>
          <p className="dash-sub">Generate a stable weekly plan tailored to your preferences.</p>
        </div>

        <div className="dash-head-actions">
          <button className="dash-primary" onClick={run} disabled={loading}>
            {loading ? "Generating..." : "Generate weekly plan"}
          </button>
          {plan && (
            <button className="dash-secondary" onClick={buildCart}>
              Generate cart
            </button>
          )}
        </div>
      </div>

      {err && <div className="dash-alert">{err}</div>}

      {plan && (
        <>
          <div className="dash-card">
            <div className="dash-card-title">Weekly summary</div>
            <div className="dash-mini">
              Daily target: <b>{plan.dailyTargetCalories}</b> kcal • Meals/day: <b>{plan.mealsPerDay}</b>
            </div>
          </div>

          <div className="dash-grid">
            {plan.days.map((d) => (
              <div key={d.date} className="dash-card">
                <div className="dash-card-title">{d.date}</div>
                <div className="dash-plan">
                  {d.meals.map((m) => (
                    <div key={m.mealType} className="dash-plan-row">
                      <span className="dash-plan-meal">{m.mealType}</span>
                      <span className="dash-plan-title">{m.recipe.title}</span>
                      <span className="dash-plan-cal">{m.recipe.nutrition.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {cart && (
        <div className="dash-card" style={{ marginTop: 14 }}>
          <div className="dash-card-title">Cart (from plan)</div>
          <div className="dash-mini">Ingredients aggregated from the weekly plan.</div>
          <ul className="dash-list" style={{ marginTop: 10 }}>
            {cart.items.map((it, idx) => (
              <li key={idx}>{it.name} — {it.qty}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}