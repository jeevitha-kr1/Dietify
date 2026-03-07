export function calculateMacros(calories, goal) {

  let proteinRatio = 0.30;
  let carbRatio = 0.40;
  let fatRatio = 0.30;

  // Adjust ratios based on goal
  if (goal === "Fat Loss") {
    proteinRatio = 0.35;
    carbRatio = 0.35;
    fatRatio = 0.30;
  }

  if (goal === "Muscle Gain") {
    proteinRatio = 0.30;
    carbRatio = 0.45;
    fatRatio = 0.25;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fats: Math.round((calories * fatRatio) / 9)
  };
}