import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "../styles/Registration.css";

export default function Registration() {
  const location = useLocation();
  const navigate = useNavigate();

  //Persist gender safely across refresh
  const gender = useMemo(() => {
    const g = location?.state?.gender;
    if (g) {
      localStorage.setItem("dietify_selected_gender", g);
      return g;
    }
    return localStorage.getItem("dietify_selected_gender") || "Not selected";
  }, [location]);

  const [mode, setMode] = useState("register");
  const [toast, setToast] = useState({ show: false, message: "" });

  // Password live error state
  const [passwordError, setPasswordError] = useState("");

  // Country list with ISO codes (required)
  const COUNTRY_CODES = [
    { iso: "DE", code: "+49", label: "Germany", flag: "🇩🇪" },
    { iso: "IN", code: "+91", label: "India", flag: "🇮🇳" },
    { iso: "US", code: "+1", label: "USA", flag: "🇺🇸" },
    { iso: "GB", code: "+44", label: "UK", flag: "🇬🇧" },
    { iso: "AE", code: "+971", label: "UAE", flag: "🇦🇪" },
  ];

  // Registration state
  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryIso: "DE",
    countryCode: "+49",
    phoneNumber: "",
    password: "",
  });

  // Login state
  const [login, setLogin] = useState({
    identifier: "",
    password: "",
  });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2400);
  };


  //Validation helpers
 
  const isValidName = (name) => /^[A-Za-z ]{2,40}$/.test(name.trim());

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const isValidIdentifier = (value) => {
    const v = value.trim();
    return isValidEmail(v) || /^\+\d{7,15}$/.test(v);
  };

  // Password validator
  const validatePassword = (pw) => {
    if (!pw || pw.length < 6)
      return "Password must be at least 6 characters.";

    if (!/[A-Za-z]/.test(pw))
      return "Include at least one letter.";

    if (!/\d/.test(pw))
      return "Include at least one number.";

    if (!/[!@#$%^&*()_+\-=[\]{};:'",.?/\\|`~<>]/.test(pw))
      return "Include at least one special character.";

    return "";
  };

  // Phone validator per country
  const validatePhoneByCountry = (countryIso, nationalNumber) => {
    const digits = (nationalNumber || "").replace(/[^\d]/g, "");
    if (!digits) return { ok: false, message: "Enter your phone number." };

    const phone = parsePhoneNumberFromString(digits, countryIso);
    if (!phone || !phone.isValid())
      return { ok: false, message: "Invalid phone number for selected country." };

    return { ok: true, e164: phone.number };
  };


  //  Handle Register
  
  const handleRegister = (e) => {
    e.preventDefault();

    if (!isValidName(reg.firstName))
      return showToast("Enter a valid first name.");

    if (!isValidName(reg.lastName))
      return showToast("Enter a valid last name.");

    if (!isValidEmail(reg.email))
      return showToast("Enter a valid email.");

    const phoneCheck = validatePhoneByCountry(
      reg.countryIso,
      reg.phoneNumber
    );
    if (!phoneCheck.ok) return showToast(phoneCheck.message);

    const pwError = validatePassword(reg.password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }

    // STORE USER
    // Saved under: localStorage key "dietify_user"
    // Phone stored in international format for reliable login matching
    localStorage.setItem(
      "dietify_user",
      JSON.stringify({
        firstName: reg.firstName.trim(),
        lastName: reg.lastName.trim(),
        email: reg.email.trim(),
        phone: phoneCheck.e164,
        password: reg.password,
        gender,
      })
    );

    showToast("Profile created! Now login.");

    setMode("login");
    setLogin({ identifier: reg.email.trim(), password: "" });
  };

 
  //  Handle Login
 
  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidIdentifier(login.identifier))
      return showToast("Enter a valid Email or Phone.");

    const saved = JSON.parse(localStorage.getItem("dietify_user") || "null");
    if (!saved) return showToast("No profile found.");

    const okId =
      login.identifier.trim() === saved.email ||
      login.identifier.trim() === saved.phone;

    const okPw = login.password === saved.password;

    if (!okId || !okPw)
      return showToast("Incorrect credentials.");

    showToast("Login successful ");

    setTimeout(() => navigate("/steps"), 1000);
  };

 
  // Password live check 

  const handlePasswordChange = (value) => {
    setReg({ ...reg, password: value });

    const err = validatePassword(value);
    setPasswordError(err);
  };

 //UI
  return (
    <div className="reg-page">
      {toast.show && <div className="reg-toast">{toast.message}</div>}

      <div className="reg-wrap">
        <div className="reg-card">
          <h1 className="reg-title">
            {mode === "register" ? "Create Profile" : "Login"}
          </h1>

          <div className="reg-tabs">
            <button
              type="button"
              className={`reg-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Sign Up
            </button>

            <button
              type="button"
              className={`reg-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </div>

          {/* ================= REGISTER ================= */}
          {mode === "register" && (
            <form className="reg-form" onSubmit={handleRegister}>
              <label className="reg-label">
                First Name
                <input
                  className="reg-input"
                  value={reg.firstName}
                  onChange={(e) =>
                    setReg({ ...reg, firstName: e.target.value })
                  }
                />
              </label>

              <label className="reg-label">
                Last Name
                <input
                  className="reg-input"
                  value={reg.lastName}
                  onChange={(e) =>
                    setReg({ ...reg, lastName: e.target.value })
                  }
                />
              </label>

              <label className="reg-label">
                Email
                <input
                  className="reg-input"
                  value={reg.email}
                  onChange={(e) =>
                    setReg({ ...reg, email: e.target.value })
                  }
                />
              </label>

              {/* Phone */}
              <label className="reg-label">
                Phone
                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    className="reg-input"
                    style={{ width: 170 }}
                    value={reg.countryIso}
                    onChange={(e) => {
                      const selected = COUNTRY_CODES.find(
                        (c) => c.iso === e.target.value
                      );
                      setReg((prev) => ({
                        ...prev,
                        countryIso: selected.iso,
                        countryCode: selected.code,
                      }));
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.iso} value={c.iso}>
                        {c.flag} {c.code} ({c.label})
                      </option>
                    ))}
                  </select>

                  <input
                    className="reg-input"
                    value={reg.phoneNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                      setReg({ ...reg, phoneNumber: digitsOnly });
                    }}
                    inputMode="numeric"
                  />
                </div>
              </label>

              {/* Password  */}
              <label className="reg-label">
                Password (min 6 characters)
                <input
                  className="reg-input"
                  value={reg.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />

                {/* ONLY SHOW WHEN INVALID */}
                {passwordError && (
                  <small className="reg-hint" style={{ color: "#d32f2f" }}>
                    {passwordError}
                  </small>
                )}
              </label>

              <button className="reg-primary" type="submit">
                Create Profile
              </button>
            </form>
          )}

          {/* ================= LOGIN ================= */}
          {mode === "login" && (
            <form className="reg-form" onSubmit={handleLogin}>
              <label className="reg-label">
                Email or Phone
                <input
                  className="reg-input"
                  value={login.identifier}
                  onChange={(e) =>
                    setLogin({ ...login, identifier: e.target.value })
                  }
                />
              </label>

              <label className="reg-label">
                Password
                <input
                  className="reg-input"
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
              </label>

              <button className="reg-primary" type="submit">
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}