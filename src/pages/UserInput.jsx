import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserInput.css"; // adjust path if your css file is elsewhere

export default function UserInput() {
  const navigate = useNavigate();

  const TOTAL_STEPS = 8;

  const ALLERGY_OPTIONS = [
    "Peanuts",
    "Tree Nuts",
    "Milk / Dairy",
    "Eggs",
    "Wheat / Gluten",
    "Soy",
    "Fish",
    "Shellfish",
    "Sesame",
  ];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ allergies: [] });
  const [error, setError] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAllergy = (allergy) => {
    setFormData((prev) => {
      const current = prev.allergies || [];
      const exists = current.includes(allergy);
      const updated = exists ? current.filter((a) => a !== allergy) : [...current, allergy];
      return { ...prev, allergies: updated };
    });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.gender) return "Please select your gender.";
        break;

      case 2:
        if (formData.age == null || formData.age === "") return "Please enter your age.";
        if (formData.age < 0) return "Age cannot be negative.";
        if (formData.age < 18) return "Age must be 18 or above.";
        break;

      case 3:
        if (formData.height == null || formData.height === "") return "Please enter your height.";
        if (formData.height < 0) return "Height cannot be negative.";
        break;

      case 4:
        if (formData.weight == null || formData.weight === "") return "Please enter your weight.";
        if (formData.weight < 0) return "Weight cannot be negative.";
        break;

      case 5:
        if (!formData.goal) return "Please select your goal.";
        break;

      case 6:
        if (!formData.activity) return "Please select activity level.";
        break;

      case 7:
        if (!formData.diet) return "Please select diet preference.";
        break;

      case 8:
        // Allergies step OPTIONAL.
        break;

      default:
        return "";
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    nextStep();
  };

  const handleFinish = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    navigate("/result", { state: formData });
  };

  return (
    <div className="steps-page">
      <div className="steps-card">
        <div className="steps-progress">
          <div
            className="steps-progress-bar"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <h2 className="steps-title">
          Step {step} of {TOTAL_STEPS}
        </h2>

        {error && <p className="steps-error">{error}</p>}

        <div className="steps-content">
          {step === 1 && (
            <>
              <h3>Select Gender</h3>
              <div className="steps-btn-row">
                <button
                  type="button"
                  onClick={() => handleChange("gender", "Masculine")}
                  className={`steps-pill ${formData.gender === "Masculine" ? "active" : ""}`}
                >
                  Masculine
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("gender", "Feminine")}
                  className={`steps-pill ${formData.gender === "Feminine" ? "active" : ""}`}
                >
                  Feminine
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Enter Age</h3>
              <input
                type="number"
                min={0}
                className="steps-input"
                value={formData.age ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange("age", v === "" ? "" : Number(v));
                }}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h3>Enter Height (cm)</h3>
              <input
                type="number"
                min={0}
                className="steps-input"
                value={formData.height ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange("height", v === "" ? "" : Number(v));
                }}
              />
            </>
          )}

          {step === 4 && (
            <>
              <h3>Enter Weight (kg)</h3>
              <input
                type="number"
                min={0}
                className="steps-input"
                value={formData.weight ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange("weight", v === "" ? "" : Number(v));
                }}
              />
            </>
          )}

          {step === 5 && (
            <>
              <h3>Select Goal</h3>
              <div className="steps-btn-row">
                <button
                  type="button"
                  onClick={() => handleChange("goal", "Lose")}
                  className={`steps-pill ${formData.goal === "Lose" ? "active" : ""}`}
                >
                  Weight Loss
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("goal", "Gain")}
                  className={`steps-pill ${formData.goal === "Gain" ? "active" : ""}`}
                >
                  Weight Gain
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("goal", "Maintain")}
                  className={`steps-pill ${formData.goal === "Maintain" ? "active" : ""}`}
                >
                  Maintain Weight
                </button>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h3>Activity Level</h3>
              <select
                className="steps-input"
                value={formData.activity ?? ""}
                onChange={(e) => handleChange("activity", e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </>
          )}

          {step === 7 && (
            <>
              <h3>Diet Preference</h3>
              <select
                className="steps-input"
                value={formData.diet ?? ""}
                onChange={(e) => handleChange("diet", e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Veg">Veg</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </>
          )}

          {step === 8 && (
            <>
              <h3>Allergies (optional)</h3>
              <p className="steps-subtitle">Select any that apply:</p>

              <div className="steps-allergy-list">
                <label className="steps-checkbox">
                  <input
                    type="checkbox"
                    checked={(formData.allergies || []).length === 0}
                    onChange={() => handleChange("allergies", [])}
                  />
                  None
                </label>

                {ALLERGY_OPTIONS.map((a) => (
                  <label key={a} className="steps-checkbox">
                    <input
                      type="checkbox"
                      checked={(formData.allergies || []).includes(a)}
                      onChange={() => toggleAllergy(a)}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="steps-nav">
          {step > 1 && (
            <button type="button" className="steps-secondary" onClick={prevStep}>
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button type="button" className="steps-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="button" className="steps-primary" onClick={handleFinish}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}