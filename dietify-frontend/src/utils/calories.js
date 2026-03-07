export function calculateBMR({ gender, weight, height, age }) {

  const safeWeight = Number(weight);
  const safeHeight = Number(height);
  const safeAge = Number(age);

  if (gender === "Male") {
    return (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge) + 5;
  }

  // Default formula for Female
  return (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge) - 161;
}


// Activity multiplier used to estimate daily calories
export function getActivityMultiplier(level) {

  const multipliers = {
    Sedentary: 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725
  };

  return multipliers[level] || 1.2;
}


// Calculate recommended daily calorie intake
export function calculateDailyCalories(profile) {

  const bmr = calculateBMR(profile);

  const maintenanceCalories =
    bmr * getActivityMultiplier(profile.activityLevel);

  // Adjust calories based on goal
  if (profile.goal === "Fat Loss") {
    return Math.round(maintenanceCalories - 400);
  }

  if (profile.goal === "Muscle Gain") {
    return Math.round(maintenanceCalories + 250);
  }

  // Maintain weight
  return Math.round(maintenanceCalories);
}