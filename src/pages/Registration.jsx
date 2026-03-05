import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "../styles/Registration.css";

// ✅ Demo auth (stores ONLY salt+hash, never raw password)
import { registerUser, verifyLogin } from "../utils/auth/demoAuth";

export default function Registration() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Persist gender across refresh (safe for demo)
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

  // ✅ Remember me
  const [rememberMe, setRememberMe] = useState(false);

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

  // ===== Validators =====
  const isValidName = (name) => /^[A-Za-z ]{2,40}$/.test(name.trim());
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  // login identifier can be email OR E.164 phone (+49...)
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

  // Country-aware phone validation using libphonenumber-js
  const validatePhoneByCountry = (countryIso, nationalNumber) => {
    const digits = (nationalNumber || "").replace(/[^\d]/g, "");
    if (!digits) return { ok: false, message: "Enter your phone number." };

    const phone = parsePhoneNumberFromString(digits, countryIso);
    if (!phone || !phone.isValid())
      return { ok: false, message: "Invalid phone number for selected country." };

    return { ok: true, e164: phone.number }; // e.g. +491234...
  };

  const handlePasswordChange = (value) => {
    setReg((prev) => ({ ...prev, password: value }));
    setPasswordError(validatePassword(value));
  };

  useEffect(() => {
    setPasswordError("");
  }, [mode]);

  // ===== Submit handlers =====
  const handleRegister = async (e) => {
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

    try {
      // ✅ Stores only salt+hash (NOT the raw password)
      await registerUser({
        firstName: reg.firstName.trim(),
        lastName: reg.lastName.trim(),
        email: reg.email.trim(),
        phone: phoneCheck.e164,
        gender,
        password: reg.password,
      });

      showToast("Profile created ✅ Now login to continue.", "success");
      setMode("login");
      setLogin({ identifier: reg.email.trim(), password: "" });
      setReg((prev) => ({ ...prev, password: "" })); // clear password field
      setShowRegPassword(false);
    } catch (err) {
      console.error(err);
      triggerShake();
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidIdentifier(login.identifier)) {
      triggerShake();
      return showToast("Enter Email or Phone (e.g. +491234...).", "error");
    }

    try {
      const result = await verifyLogin({
        identifier: login.identifier.trim(),
        password: login.password,
      });

      if (!result.ok) {
        triggerShake();
        if (result.reason === "NO_PROFILE") return showToast("No profile found. Please create one first.", "error");
        return showToast("Incorrect credentials.", "error");
      }

      // ✅ Remember me session token (demo)
      if (rememberMe) {
        localStorage.setItem("dietify_session_active", "1");
        sessionStorage.removeItem("dietify_session_active");
      } else {
        sessionStorage.setItem("dietify_session_active", "1");
        localStorage.removeItem("dietify_session_active");
      }

      showToast("Welcome back ✅", "success");
      setLogin((prev) => ({ ...prev, password: "" })); // clear password after login
      setShowLoginPassword(false);

      setTimeout(() => navigate("/user-input"), 700);
    } catch (err) {
      console.error(err);
      triggerShake();
      showToast("Login failed. Please try again.", "error");
    }
  };

  return (
    <div className="reg-hero" data-cy="registration-page">
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
          {/* ✅ Clean, professional header (minimal) */}
          <div className="reg-top">
            <div className="reg-step-badge">Let’s get to know you</div>

            <h1 className="reg-title">Create your Dietify profile</h1>

            <p className="reg-subtitle">
              Creating a profile helps Dietify personalize your recommendations and track your progress over time.
            </p>

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

          {/* ===== SIGN UP ===== */}
          {mode === "register" && (
            <form className="reg-form" onSubmit={handleRegister} data-cy="signup-form">
              <div className="reg-grid">
                <label className="reg-label">
                  First name
                  <input
                    className="reg-input"
                    value={reg.firstName}
                    placeholder="Your first name"
                    onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                    autoComplete="given-name"
                    data-cy="first-name"
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
                    data-cy="last-name"
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
                  data-cy="email"
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
                    data-cy="country-select"
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
                    data-cy="phone"
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
                    data-cy="signup-password"
                  />
                  <button
                    type="button"
                    className="reg-eye"
                    onClick={() => setShowRegPassword((s) => !s)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                    data-cy="toggle-signup-password"
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

              <button className="reg-primary" type="submit" data-cy="signup-submit">
                Create profile
              </button>
            </form>
          )}

          {/* ===== LOGIN ===== */}
          {mode === "login" && (
            <form className="reg-form" onSubmit={handleLogin} data-cy="login-form">
              <label className="reg-label">
                Email or phone
                <input
                  className="reg-input"
                  value={login.identifier}
                  placeholder="Email or +49123456789"
                  onChange={(e) => setLogin({ ...login, identifier: e.target.value })}
                  autoComplete="username"
                  data-cy="login-identifier"
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
                    data-cy="login-password"
                  />
                  <button
                    type="button"
                    className="reg-eye"
                    onClick={() => setShowLoginPassword((s) => !s)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    data-cy="toggle-login-password"
                  >
                    {showLoginPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {/* ✅ Remember me */}
              <label className="reg-remember" data-cy="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button className="reg-primary" type="submit" data-cy="login-submit">
                Login
              </button>

              <div className="reg-switch">
                Don’t have an account?{" "}
                <button type="button" className="reg-link" onClick={() => setMode("register")} data-cy="switch-to-signup">
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