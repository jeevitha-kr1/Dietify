export function calculateBMR({ gender, weight, height, age }) {
  const safeWeight = Number(weight);
  const safeHeight = Number(height);
  const safeAge = Number(age);
  const safeGender = String(gender || "").trim().toLowerCase();

  if (!safeWeight || !safeHeight || !safeAge) return 0;

  if (safeGender === "male") {
    return (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge) + 5;
  }

  return (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge) - 161;
}

export function getActivityMultiplier(level) {
  const safeLevel = String(level || "").trim().toLowerCase();

  const multipliers = {
    sedentary: 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725,
    "extra active": 1.9,
  };

  return multipliers[safeLevel] || 1.2;
}

export function calculateDailyCalories(profile) {
  const bmr = calculateBMR(profile);
  const maintenanceCalories = bmr * getActivityMultiplier(profile.activityLevel);

  const safeGoal = String(profile.goal || "").trim().toLowerCase();
  const safeGender = String(profile.gender || "").trim().toLowerCase();
  const currentWeight = Number(profile.weight);
  const targetWeight = Number(profile.targetWeight);

  let calories = maintenanceCalories;

  if (safeGoal === "fat loss") {
    const weightDifference =
      currentWeight && targetWeight
        ? Math.max(currentWeight - targetWeight, 0)
        : 0;

    const deficit = weightDifference >= 15 ? 500 : 350;
    calories = maintenanceCalories - deficit;
  } else if (safeGoal === "muscle gain") {
    calories = maintenanceCalories + 250;
  } else {
    calories = maintenanceCalories;
  }

  if (safeGender === "female") {
    calories = Math.max(calories, 1200);
  } else {
    calories = Math.max(calories, 1500);
  }

  return Math.round(calories);
}