import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { onboardingQuestions } from "../data/onboardingQuestions";
import { setUserProfile, clearUserProfile } from "../store/slices/userSlice";
import { setResults, clearResults } from "../store/slices/resultSlice";

import { calculateBMI, getBMICategory } from "../utils/bmi";
import { calculateDailyCalories } from "../utils/calories";
import { calculateMacros } from "../utils/macros";
import { clearCart } from "../store/slices/cartSlice";
import { clearAiData } from "../store/slices/aiSlice";
import { useAuth } from "../hooks/useAuth";

import "../styles/UserInput.css";

const DEFAULT_ANSWERS = {
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
};

export default function UserInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [error, setError] = useState("");
  const [showSavedProfileCard, setShowSavedProfileCard] = useState(false);
  const [isEditingSavedAnswers, setIsEditingSavedAnswers] = useState(false);

  const currentQuestion = onboardingQuestions[currentStep];

  const storageKey = useMemo(() => {
    if (!currentUser?.email) return null;
    return `dietify_user_profile_${currentUser.email}`;
  }, [currentUser]);

  const progressValue = useMemo(() => {
    return ((currentStep + 1) / onboardingQuestions.length) * 100;
  }, [currentStep]);

  const isProfileComplete = (data) => {
    return onboardingQuestions
      .filter((question) => question.required)
      .every((question) => {
        const value = data[question.id];

        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return value !== "" && value !== null && value !== undefined;
      });
  };

  useEffect(() => {
    if (!storageKey) return;

    try {
      const savedAnswersRaw = localStorage.getItem(storageKey);

      if (!savedAnswersRaw) return;

      const savedAnswers = JSON.parse(savedAnswersRaw);
      const mergedAnswers = {
        ...DEFAULT_ANSWERS,
        ...savedAnswers,
      };

      setAnswers(mergedAnswers);

      const wantsEditMode = location.state?.editSavedProfile === true;

      if (isProfileComplete(mergedAnswers) && !wantsEditMode) {
        setShowSavedProfileCard(true);
      } else {
        setShowSavedProfileCard(false);
        setIsEditingSavedAnswers(wantsEditMode);
      }
    } catch (loadError) {
      console.error("Failed to load saved answers:", loadError);
    }
  }, [storageKey, location.state]);

  const saveAnswersLocally = (data) => {
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (saveError) {
      console.error("Failed to save answers:", saveError);
    }
  };

  const handleSingleValueChange = (event) => {
    const { value } = event.target;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));

    setError("");
  };

  const handleMultiSelectChange = (option) => {
    setAnswers((previous) => {
      const existingValues = previous[currentQuestion.id] || [];

      if (option === "None") {
        const alreadySelected = existingValues.includes("None");
        return {
          ...previous,
          [currentQuestion.id]: alreadySelected ? [] : ["None"],
        };
      }

      const withoutNone = existingValues.filter((item) => item !== "None");
      const updatedValues = withoutNone.includes(option)
        ? withoutNone.filter((item) => item !== option)
        : [...withoutNone, option];

      return {
        ...previous,
        [currentQuestion.id]: updatedValues,
      };
    });

    setError("");
  };

  const validateCurrentStep = () => {
    if (!currentQuestion) return false;

    const value = answers[currentQuestion.id];

    if (currentQuestion.required === true) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          setError("Please select at least one option before continuing.");
          return false;
        }
      } else {
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          String(value).trim() === ""
        ) {
          setError("Please answer this question before continuing.");
          return false;
        }
      }
    }

    if (currentQuestion.id === "age" && String(value).trim() !== "") {
      const age = Number(value);
      if (Number.isNaN(age) || age < 16 || age > 100) {
        setError("Age must be between 16 and 100.");
        return false;
      }
    }

    if (currentQuestion.id === "height" && String(value).trim() !== "") {
      const height = Number(value);
      if (Number.isNaN(height) || height < 100 || height > 250) {
        setError("Height must be between 100 cm and 250 cm.");
        return false;
      }
    }

    if (currentQuestion.id === "weight" && String(value).trim() !== "") {
      const weight = Number(value);
      if (Number.isNaN(weight) || weight < 30 || weight > 300) {
        setError("Weight must be between 30 kg and 300 kg.");
        return false;
      }
    }

    if (currentQuestion.id === "targetWeight" && String(value).trim() !== "") {
      const targetWeight = Number(value);
      if (Number.isNaN(targetWeight) || targetWeight < 30 || targetWeight > 300) {
        setError("Target weight must be between 30 kg and 300 kg.");
        return false;
      }
    }

    if (currentQuestion.id === "mealsPerDay" && String(value).trim() !== "") {
      const mealsPerDay = Number(value);
      if (Number.isNaN(mealsPerDay) || mealsPerDay < 1 || mealsPerDay > 8) {
        setError("Meals per day must be between 1 and 8.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
      setError("");
    }
  };

  const handleNext = () => {
    const isValid = validateCurrentStep();

    if (!isValid) return;

    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep((previous) => previous + 1);
      setError("");
    }
  };

  const handleSkip = () => {
    if (currentQuestion.required === true) {
      setError("This question is required and cannot be skipped.");
      return;
    }

    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep((previous) => previous + 1);
      setError("");
    }
  };

  const buildAndSaveResults = () => {
    saveAnswersLocally(answers);
    dispatch(setUserProfile(answers));

    const bmi = calculateBMI(answers.height, answers.weight);
    const bmiCategory = getBMICategory(bmi);
    const calories = calculateDailyCalories(answers);
    const macros = calculateMacros(calories, answers);

    dispatch(
      setResults({
        bmi,
        bmiCategory,
        calories,
        macros,
      })
    );
  };

  const handleFinish = () => {
    const isValid = validateCurrentStep();

    if (!isValid) return;

    buildAndSaveResults();
    navigate("/result");
  };

  const handleContinueWithSavedAnswers = () => {
    buildAndSaveResults();
    navigate("/result");
  };

  const handleEditSavedAnswers = () => {
    setShowSavedProfileCard(false);
    setIsEditingSavedAnswers(true);
    setCurrentStep(0);
    setError("");
  };

  const handleResetSavedAnswers = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

    setAnswers(DEFAULT_ANSWERS);
    setCurrentStep(0);
    setError("");
    setShowSavedProfileCard(false);
    setIsEditingSavedAnswers(false);

    dispatch(clearUserProfile());
    dispatch(clearResults());
    dispatch(clearCart());
    dispatch(clearAiData());
  };

  const renderQuestionField = () => {
    const fieldValue = answers[currentQuestion.id];

    if (currentQuestion.type === "number") {
      return (
        <input
          className={`userinput-field ${error ? "input-error" : ""}`}
          type="number"
          value={fieldValue}
          onChange={handleSingleValueChange}
          placeholder="Type your answer"
          min="0"
        />
      );
    }

    if (currentQuestion.type === "select") {
      return (
        <select
          className={`userinput-field ${error ? "input-error" : ""}`}
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

    if (currentQuestion.type === "multiselect") {
      return (
        <div className="userinput-multiselect">
          {currentQuestion.options.map((option) => {
            const checked = (fieldValue || []).includes(option);

            return (
              <label
                key={option}
                className={`userinput-choice-card ${
                  checked ? "userinput-choice-card--active" : ""
                }`}
              >
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

  if (showSavedProfileCard && !isEditingSavedAnswers) {
    return (
      <main className="userinput-page">
        <section className="userinput-center-shell">
          <section className="userinput-focus-card glass-card userinput-saved-card">
            <p className="userinput-kicker">Profile already saved</p>
            <h1 className="userinput-title userinput-title--saved">
              Welcome back, {currentUser?.fullName?.split(" ")[0] || "there"}.
            </h1>
            <p className="userinput-helper userinput-helper--saved">
              Your nutrition profile is already saved on this browser. You can
              continue with your saved answers, update them, or reset everything
              and start again.
            </p>

            <div className="userinput-saved-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinueWithSavedAnswers}
              >
                Continue
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleEditSavedAnswers}
              >
                Update Answers
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleResetSavedAnswers}
              >
                Reset Saved Answers
              </button>
            </div>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="userinput-page">
      <section className="userinput-center-shell">
        <section className="userinput-focus-card glass-card">
          <div className="userinput-progress-block">
            <p className="userinput-step">
              Question {currentStep + 1} of {onboardingQuestions.length}
            </p>

            <div className="userinput-progress">
              <div
                className="userinput-progress-fill"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>

          <div className="userinput-main">
            <h1 className="userinput-title">{currentQuestion.label}</h1>
            <p className="userinput-helper">
              {currentQuestion.required ? "Required" : "Optional"}
            </p>

            <div className="userinput-field-wrap">{renderQuestionField()}</div>

            {error ? <p className="form-message form-message--error">{error}</p> : null}

            <div className="userinput-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </button>

              {!currentQuestion.required &&
              currentStep !== onboardingQuestions.length - 1 ? (
                <button type="button" className="btn btn-ghost" onClick={handleSkip}>
                  Skip
                </button>
              ) : null}

              {currentStep === onboardingQuestions.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={handleFinish}>
                  Finish
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}