import { useState } from "react";
import { generateRecipes } from "../../api/recipes";

const INPUT_KEY = "dietify_user_inputs_v1";
const SAVED_KEY = "dietify_saved_recipes_v1";

function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(INPUT_KEY) || "{}")?.answers || {};
  } catch {
    return {};
  }
}

export default function DashboardRecipes() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [err, setErr] = useState("");

  const run = async () => {
    try {
      setErr("");
      setLoading(true);
      const answers = getAnswers();
      const data = await generateRecipes(answers);
      setRecipes(data.recipes || []);
    } catch (e) {
      setErr(e.message || "Failed to generate recipes");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = (r) => {
    const current = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify([{ ...r, savedAt: new Date().toISOString() }, ...current])
    );
    alert("Saved ✅");
  };

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <h1 className="dash-h1">Recipes</h1>
          <p className="dash-sub">Personalized recipes based on diet, allergies, and conditions.</p>
        </div>

        <div className="dash-head-actions">
          <button className="dash-primary" onClick={run} disabled={loading}>
            {loading ? "Generating..." : "Generate recipes"}
          </button>
        </div>
      </div>

      {err && <div className="dash-alert">{err}</div>}

      <div className="dash-grid">
        {recipes.map((r) => (
          <div key={r.id} className="dash-card">
            <div className="dash-card-title">{r.title}</div>
            <div className="dash-mini">
              {r.nutrition?.calories} kcal • P {r.nutrition?.proteinG}g • C {r.nutrition?.carbsG}g • F {r.nutrition?.fatG}g
            </div>

            <div className="dash-tags">
              {(r.tags || []).map((t) => (
                <span key={t} className="dash-tag">{t}</span>
              ))}
            </div>

            <div className="dash-split">
              <div>
                <div className="dash-section">Ingredients</div>
                <ul className="dash-list">
                  {(r.ingredients || []).slice(0, 5).map((i, idx) => (
                    <li key={idx}>{i.name} — {i.qty}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="dash-section">Steps</div>
                <ol className="dash-list">
                  {(r.steps || []).slice(0, 3).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="dash-actions-row">
              <button className="dash-secondary" onClick={() => saveRecipe(r)}>
                Save
              </button>
              <button className="dash-ghost" onClick={() => alert("Next: Add ingredients to cart from recipe")}>
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}