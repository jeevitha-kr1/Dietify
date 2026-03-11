export function calculateMacros(calories, profile) {
  const safeCalories = Number(calories) || 0;
  const safeWeight = Number(profile?.weight) || 0;
  const safeGoal = String(profile?.goal || "").trim().toLowerCase();

  let proteinPerKg = 1.6;
  let fatPerKg = 0.8;

  if (safeGoal === "fat loss") {
    proteinPerKg = 2.0;
    fatPerKg = 0.8;
  } else if (safeGoal === "muscle gain") {
    proteinPerKg = 1.8;
    fatPerKg = 0.9;
  }

  const protein = Math.round(safeWeight * proteinPerKg);
  const fats = Math.round(safeWeight * fatPerKg);

  const proteinCalories = protein * 4;
  const fatCalories = fats * 9;
  const remainingCalories = safeCalories - proteinCalories - fatCalories;

  const carbs = Math.max(50, Math.round(remainingCalories / 4));

  return {
    protein,
    carbs,
    fats,
  };
}