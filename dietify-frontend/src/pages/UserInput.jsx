import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { onboardingQuestions } from "../data/onboardingQuestions";
import { setUserProfile } from "../store/slices/userSlice";
import { setResults } from "../store/slices/resultSlice";

import { calculateBMI, getBMICategory } from "../utils/bmi";
import { calculateDailyCalories } from "../utils/calories";
import { calculateMacros } from "../utils/macros";

import "../styles/UserInput.css";

export default function UserInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Tracks which question is currently shown
  const [currentStep, setCurrentStep] = useState(0);

  // Stores all user answers
  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    activityLevel: "",
    goal: "",
    dietPreference: "",
    allergies: [],
    mealsPerDay: "",
    preferredCuisine: "",
    healthConditions: [],
  });

  // Error message for required fields
  const [error, setError] = useState("");

  // Current question object from the data file
  const currentQuestion = onboardingQuestions[currentStep];

  // Progress percentage for progress bar
  const progressValue = useMemo(() => {
    return ((currentStep + 1) / onboardingQuestions.length) * 100;
  }, [currentStep]);

  // Update answer for normal input/select fields
  const handleSingleValueChange = (event) => {
    const { value } = event.target;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));

    setError("");
  };

  // Update answer for multiselect checkbox fields
  const handleMultiSelectChange = (option) => {
    setAnswers((previous) => {
      const existingValues = previous[currentQuestion.id] || [];

      const updatedValues = existingValues.includes(option)
        ? existingValues.filter((item) => item !== option)
        : [...existingValues, option];

      return {
        ...previous,
        [currentQuestion.id]: updatedValues,
      };
    });

    setError("");
  };

  // Checks whether current required question is answered
  const validateCurrentStep = () => {
    if (!currentQuestion.required) {
      return true;
    }

    const value = answers[currentQuestion.id];

    // Validation for multiselect
    if (Array.isArray(value)) {
      if (value.length === 0) {
        setError("Please select at least one option or skip if optional.");
        return false;
      }
      return true;
    }

    // Validation for normal inputs
    if (value === "" || value === null || value === undefined) {
      setError("Please answer this question before continuing.");
      return false;
    }

    return true;
  };

  // Move to next question
  const handleNext = () => {
    const isValid = validateCurrentStep();

    if (!isValid) {
      return;
    }

    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep((previous) => previous + 1);
      setError("");
    }
  };

  // Move to previous question
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
      setError("");
    }
  };

  // Skip only optional questions
  const handleSkip = () => {
    if (!currentQuestion.required && currentStep < onboardingQuestions.length - 1) {
      setCurrentStep((previous) => previous + 1);
      setError("");
    }
  };

  // Final submit: save profile + calculate health metrics + navigate to results
  const handleFinish = () => {
    const isValid = validateCurrentStep();

    if (!isValid) {
      return;
    }

    // Save full questionnaire answers to Redux
    dispatch(setUserProfile(answers));

    // Calculate body metrics
    const bmi = calculateBMI(answers.height, answers.weight);
    const bmiCategory = getBMICategory(bmi);
    const calories = calculateDailyCalories(answers);
    const macros = calculateMacros(calories, answers.goal);

    // Save calculated results to Redux
    dispatch(
      setResults({
        bmi,
        bmiCategory,
        calories,
        macros,
      })
    );

    // Move user to results page
    navigate("/result");
  };

  // Render input UI based on question type
  const renderQuestionField = () => {
    const fieldValue = answers[currentQuestion.id];

    // Number input field
    if (currentQuestion.type === "number") {
      return (
        <input
          className="userinput-field"
          type="number"
          value={fieldValue}
          onChange={handleSingleValueChange}
          placeholder="Enter your answer"
          min="0"
        />
      );
    }

    // Dropdown select field
    if (currentQuestion.type === "select") {
      return (
        <select
          className="userinput-field"
          value={fieldValue}
          onChange={handleSingleValueChange}
        >
          <option value="">Select an option</option>
          {currentQuestion.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Multiselect checkbox field
    if (currentQuestion.type === "multiselect") {
      return (
        <div className="userinput-multiselect">
          {currentQuestion.options.map((option) => {
            const checked = (fieldValue || []).includes(option);

            return (
              <label key={option} className="userinput-checkbox-card">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleMultiSelectChange(option)}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <main className="userinput-page">
      <section className="userinput-card">
        <p className="userinput-step">
          Question {currentStep + 1} of {onboardingQuestions.length}
        </p>

        {/* Progress bar */}
        <div className="userinput-progress">
          <div
            className="userinput-progress-fill"
            style={{ width: `${progressValue}%` }}
          />
        </div>

        {/* Current question */}
        <h1 className="userinput-title">{currentQuestion.label}</h1>

        {/* Required/optional status */}
        <p className="userinput-helper">
          {currentQuestion.required ? "Required" : "Optional"}
        </p>

        {/* Dynamic field */}
        <div className="userinput-field-wrap">{renderQuestionField()}</div>

        {/* Validation message */}
        {error ? <p className="userinput-error">{error}</p> : null}

        {/* Navigation buttons */}
        <div className="userinput-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {!currentQuestion.required ? (
            <button type="button" className="ghost-btn" onClick={handleSkip}>
              Skip
            </button>
          ) : null}

          {currentStep === onboardingQuestions.length - 1 ? (
            <button type="button" className="primary-btn" onClick={handleFinish}>
              Finish
            </button>
          ) : (
            <button type="button" className="primary-btn" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </section>
    </main>
  );
}