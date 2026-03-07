// BMI = weight(kg) / height(m)^2

export function calculateBMI(heightCm, weightKg) {
  const heightMeters = Number(heightCm) / 100;

  if (!heightMeters || !weightKg) {
    return 0;
  }

  const bmi = Number(weightKg) / (heightMeters * heightMeters);

  // Return rounded BMI value
  return Number(bmi.toFixed(1));
}


// Determine BMI category based on standard WHO classification
export function getBMICategory(bmi) {

  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi >= 18.5 && bmi < 25) {
    return "Normal weight";
  }

  if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  }

  return "Obesity";
}