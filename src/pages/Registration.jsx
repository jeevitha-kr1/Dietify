import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "../styles/Registration.css";

export default function Registration() {
  const location = useLocation();
  const navigate = useNavigate();

  const gender = useMemo(() => {
    const g = location?.state?.gender;
    if (g) {
      localStorage.setItem("dietify_selected_gender", g);
      return g;
    }
    return localStorage.getItem("dietify_selected_gender") || "Not selected";
  }, [location]);

  const [mode, setMode] = useState("register");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const [passwordError, setPasswordError] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [shake, setShake] = useState(false);
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const COUNTRY_CODES = [
    { iso: "DE", code: "+49", label: "Germany", flag: "🇩🇪" },
    { iso: "IN", code: "+91", label: "India", flag: "🇮🇳" },
    { iso: "US", code: "+1", label: "USA", flag: "🇺🇸" },
    { iso: "GB", code: "+44", label: "UK", flag: "🇬🇧" },
    { iso: "AE", code: "+971", label: "UAE", flag: "🇦🇪" },
  ];

  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryIso: "DE",
    countryCode: "+49",
    phoneNumber: "",
    password: "",
  });

  const [login, setLogin] = useState({
    identifier: "",
    password: "",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 2400);
  };

  const isValidName = (name) => /^[A-Za-z ]{2,40}$/.test(name.trim());
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const isValidIdentifier = (value) => {
    const v = value.trim();
    return isValidEmail(v) || /^\+\d{7,15}$/.test(v);
  };

  const validatePassword = (pw) => {
    if (!pw || pw.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Za-z]/.test(pw)) return "Include at least one letter.";
    if (!/\d/.test(pw)) return "Include at least one number.";
    if (!/[!@#$%^&*()_+\-=[\]{};:'",.?/\\|`~<>]/.test(pw))
      return "Include at least one special character.";
    return "";
  };

  const passwordRules = useMemo(() => {
    const pw = reg.password || "";
    return [
      { ok: pw.length >= 6, label: "At least 6 characters" },
      { ok: /[A-Za-z]/.test(pw), label: "At least 1 letter" },
      { ok: /\d/.test(pw), label: "At least 1 number" },
      { ok: /[!@#$%^&*()_+\-=[\]{};:'",.?/\\|`~<>]/.test(pw), label: "At least 1 special character" },
    ];
  }, [reg.password]);

  const validatePhoneByCountry = (countryIso, nationalNumber) => {
    const digits = (nationalNumber || "").replace(/[^\d]/g, "");
    if (!digits) return { ok: false, message: "Enter your phone number." };

    const phone = parsePhoneNumberFromString(digits, countryIso);
    if (!phone || !phone.isValid())
      return { ok: false, message: "Invalid phone number for selected country." };

    return { ok: true, e164: phone.number };
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!isValidName(reg.firstName)) {
      triggerShake();
      return showToast("Enter a valid first name.", "error");
    }
    if (!isValidName(reg.lastName)) {
      triggerShake();
      return showToast("Enter a valid last name.", "error");
    }
    if (!isValidEmail(reg.email)) {
      triggerShake();
      return showToast("Enter a valid email.", "error");
    }

    const phoneCheck = validatePhoneByCountry(reg.countryIso, reg.phoneNumber);
    if (!phoneCheck.ok) {
      triggerShake();
      return showToast(phoneCheck.message, "error");
    }

    const pwError = validatePassword(reg.password);
    if (pwError) {
      setPasswordError(pwError);
      triggerShake();
      return showToast(pwError, "error");
    }

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

    showToast("Profile created ✅ Now login to continue.", "success");
    setMode("login");
    setLogin({ identifier: reg.email.trim(), password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidIdentifier(login.identifier)) {
      triggerShake();
      return showToast("Enter Email or Phone (e.g. +491234...).", "error");
    }

    const saved = JSON.parse(localStorage.getItem("dietify_user") || "null");
    if (!saved) {
      triggerShake();
      return showToast("No profile found. Please create one first.", "error");
    }

    const okId = login.identifier.trim() === saved.email || login.identifier.trim() === saved.phone;
    const okPw = login.password === saved.password;

    if (!okId || !okPw) {
      triggerShake();
      return showToast("Incorrect credentials.", "error");
    }

    showToast("Welcome back ✅", "success");
    setTimeout(() => navigate("/steps"), 900);
  };

  const handlePasswordChange = (value) => {
    setReg({ ...reg, password: value });
    setPasswordError(validatePassword(value));
  };

  useEffect(() => {
    setPasswordError("");
  }, [mode]);

  return (
    <div className="reg-hero">
      <div className="reg-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      {toast.show && (
        <div className={`reg-toast ${toast.type}`}>
          <span className="reg-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="reg-shell">
        <main className={`reg-card ${shake ? "shake" : ""}`}>
          <div className="reg-top">
            <div className="reg-step-badge">
              {mode === "register" ? "Let’s get to know you" : "Welcome back"}
            </div>

            <h1 className="reg-title">{mode === "register" ? "Create your profile" : "Login to continue"}</h1>

            <p className="reg-subtitle">
              {mode === "register"
                ? "Answer a few basics so Dietify can personalize your meal recommendations and help you build a healthier lifestyle. Your profile also helps you track progress over time."
                : "Login to continue your plan and tracking."}
            </p>

            {mode === "register" && (
              <div className="reg-benefits">
                <div className="reg-benefit">🎯 Personalized recommendations</div>
                <div className="reg-benefit">🗓️ Weekly planning made easy</div>
                <div className="reg-benefit">📈 Track your progress</div>
              </div>
            )}

            <div className="reg-tabs" role="tablist" aria-label="Auth tabs">
              <button
                type="button"
                className={`reg-tab ${mode === "register" ? "active" : ""}`}
                onClick={() => setMode("register")}
              >
                Sign up
              </button>
              <button
                type="button"
                className={`reg-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </div>
          </div>

          {mode === "register" && (
            <form className="reg-form" onSubmit={handleRegister}>
              <div className="reg-grid">
                <label className="reg-label">
                  First name
                  <input
                    className="reg-input"
                    value={reg.firstName}
                    placeholder="Your first name"
                    onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                    autoComplete="given-name"
                  />
                </label>

                <label className="reg-label">
                  Last name
                  <input
                    className="reg-input"
                    value={reg.lastName}
                    placeholder="Your last name"
                    onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label className="reg-label">
                Email
                <input
                  className="reg-input"
                  value={reg.email}
                  placeholder="you@example.com"
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  autoComplete="email"
                  type="email"
                />
              </label>

              <label className="reg-label">
                Phone
                <div className="reg-phone-row">
                  <select
                    className="reg-input reg-select"
                    value={reg.countryIso}
                    onChange={(e) => {
                      const selected = COUNTRY_CODES.find((c) => c.iso === e.target.value);
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
                    placeholder="Digits only"
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                      setReg({ ...reg, phoneNumber: digitsOnly });
                    }}
                    inputMode="numeric"
                    autoComplete="tel-national"
                  />
                </div>

                <small className="reg-helper">We validate based on the selected country.</small>
              </label>

              <label className="reg-label">
                Password
                <div className="reg-pass-wrap">
                  <input
                    className="reg-input"
                    value={reg.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    type={showRegPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="reg-eye"
                    onClick={() => setShowRegPassword((s) => !s)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                  >
                    {showRegPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="reg-rules">
                  {passwordRules.map((r) => (
                    <div key={r.label} className={`reg-rule ${r.ok ? "ok" : ""}`}>
                      <span className="dot" />
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>

                {passwordError && <small className="reg-error">{passwordError}</small>}
              </label>

              <button className="reg-primary" type="submit">
                Create profile
              </button>

              <p className="reg-footnote">Demo build: credentials are saved locally for testing.</p>
            </form>
          )}

          {mode === "login" && (
            <form className="reg-form" onSubmit={handleLogin}>
              <label className="reg-label">
                Email or phone
                <input
                  className="reg-input"
                  value={login.identifier}
                  placeholder="Email or +49123456789"
                  onChange={(e) => setLogin({ ...login, identifier: e.target.value })}
                  autoComplete="username"
                />
              </label>

              <label className="reg-label">
                Password
                <div className="reg-pass-wrap">
                  <input
                    className="reg-input"
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    type={showLoginPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    className="reg-eye"
                    onClick={() => setShowLoginPassword((s) => !s)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button className="reg-primary" type="submit">
                Login
              </button>

              <div className="reg-switch">
                Don’t have an account?{" "}
                <button type="button" className="reg-link" onClick={() => setMode("register")}>
                  Create one
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}