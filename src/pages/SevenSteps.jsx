import { useState } from "react";
import "../styles/SevenSteps.css";
import { useNavigate } from "react-router-dom";

export default function SevenSteps() {
    const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
  switch (step) {
    case 1:
      if (!formData.gender) return "Please select your gender.";
      break;

    case 2:
      if (!formData.age) return "Please enter your age.";
      if (formData.age < 10 || formData.age > 100)
        return "Age must be between 10 and 100.";
      break;

    case 3:
      if (!formData.height) return "Please enter your height.";
      if (formData.height < 100 || formData.height > 250)
        return "Height must be between 100 and 250 cm.";
      break;

    case 4:
      if (!formData.weight) return "Please enter your weight.";
      if (formData.weight < 30 || formData.weight > 250)
        return "Weight must be between 30 and 250 kg.";
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

    default:
      return "";
  }
  return "";
};

  return (
    <div className="steps-page">
        
      <div className="steps-card">
        <div className="steps-progress">
          <div
            className="steps-progress-bar"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        <h2 className="steps-title">Step {step} of 7</h2>
        {error && <p className="steps-error">{error}</p>}

        <div className="steps-content">
          {step === 1 && (
            <>
              <h3>Select Gender</h3>
              <div className="steps-btn-row">
                <button
                    onClick={() => handleChange("gender", "Male")}
                    className={`steps-pill ${formData.gender === "Male" ? "active" : ""}`}
                >
                    Male
                </button>
                <button
                    onClick={() => handleChange("gender", "Female")}
                    className={`steps-pill ${formData.gender === "Female" ? "active" : ""}`}
                    >
                    Female
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Enter Age</h3>
              <input
                type="number"
                className="steps-input"
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h3>Enter Height (cm)</h3>
              <input
                type="number"
                className="steps-input"
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </>
          )}

          {step === 4 && (
            <>
              <h3>Enter Weight (kg)</h3>
              <input
                type="number"
                className="steps-input"
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </>
          )}

          {step === 5 && (
            <>
              <h3>Select Goal</h3>
              <div className="steps-btn-row">
                <button
                    onClick={() => handleChange("goal", "Lose")}
                    className={`steps-pill ${formData.goal === "Lose" ? "active" : ""}`}
                    >
                        Weight Loss
                </button>                
                <button
                    onClick={() => handleChange("goal", "Gain")}
                    className={`steps-pill ${formData.goal === "Gain" ? "active" : ""}`}
                    >
                        Weight Gain
                </button>            
                <button
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
              <select className="steps-input" onChange={(e) => handleChange("activity", e.target.value)}>
                <option>Select</option>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </>
          )}

          {step === 7 && (
            <>
              <h3>Diet Preference</h3>
              <select className="steps-input" onChange={(e) => handleChange("diet", e.target.value)}>
                <option>Select</option>
                <option>Veg</option>
                <option>Non-Veg</option>
              </select>
            </>
          )}
        </div>

        <div className="steps-nav">
          {step > 1 && (
            <button className="steps-secondary" onClick={prevStep}>
              Back
            </button>
          )}

          {step < 7 ? (
            <button
                className="steps-primary"
                onClick={() => {
                    const validationError = validateStep();
                    if (validationError) {
                    setError(validationError);
                    return;
                    }
                    setError("");
                    nextStep();
                }}
                >
                Next
            </button>
            ) : (
            <button
                className="steps-primary"
                onClick={() => {
                    const validationError = validateStep();
                    if (validationError) {
                    setError(validationError);
                    return;
                    }
                    setError("");
                    navigate("/result", { state: formData });
                }}
                >
                Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}