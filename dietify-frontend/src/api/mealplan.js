// src/api/mealplan.js
export async function generateMealPlan(answers) {
  const res = await fetch("http://localhost:8080/api/mealplan/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Meal plan request failed (${res.status})`);
  }

  return res.json();
}