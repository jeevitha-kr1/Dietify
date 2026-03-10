// This file stores the questionnaire configuration
// used by the UserInput page to render questions dynamically

export const onboardingQuestions = [

  {
    id: "age",
    label: "What is your age?",
    type: "number",
    required: true
  },

  {
    id: "gender",
    label: "What is your gender?",
    type: "select",
    required: true,
    options: [
      "Male",
      "Female",
      "Other",
      "Prefer not to say"
    ]
  },

  {
    id: "height",
    label: "What is your height (cm)?",
    type: "number",
    required: true
  },

  {
    id: "weight",
    label: "What is your current weight (kg)?",
    type: "number",
    required: true
  },

  {
    id: "targetWeight",
    label: "What is your target weight (kg)?",
    type: "number",
    required: true
  },

  {
    id: "activityLevel",
    label: "How active are you?",
    type: "select",
    required: true,
    options: [
      "Sedentary",
      "Lightly Active",
      "Moderately Active",
      "Very Active"
    ]
  },

  {
    id: "goal",
    label: "What is your primary goal?",
    type: "select",
    required: true,
    options: [
      "Fat Loss",
      "Muscle Gain",
      "Maintain"
    ]
  },

  {
    id: "dietPreference",
    label: "What is your diet preference?",
    type: "select",
    required: true,
    options: [
      "Vegan",
      "Vegetarian",
      "Eggetarian",
      "Non-Vegetarian",
      "Pescatarian"
    ]
  },

  {
    id: "allergies",
    label: "Do you have any food allergies?",
    type: "multiselect",
    required: false,
    options: [
      "Peanuts",
      "Dairy",
      "Gluten",
      "Soy",
      "Shellfish"
    ]
  },

  {
    id: "mealsPerDay",
    label: "How many meals do you prefer per day?",
    type: "select",
    required: true,
    options: [
      "2",
      "3",
      "4",
      "5"
    ]
  },

  {
    id: "preferredCuisine",
    label: "Preferred cuisine?",
    type: "select",
    required: false,
    options: [
      "Indian",
      "Mediterranean",
      "Asian",
      "Mixed"
    ]
  },

  {
    id: "healthConditions",
    label: "Do you have any health conditions?",
    type: "multiselect",
    required: false,
    options: [
      "Diabetes",
      "High Blood Pressure",
      "Thyroid Issues",
      "High Cholesterol",
      "None"
    ]
  }

];