import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js"; 
import "../styles/Registration.css";

export default function Registration() {
  const location = useLocation();
  const navigate = useNavigate();

  // gender: state first, then localStorage fallback (refresh-safe)
  // We store it so refresh doesn't lose the chosen gender.
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

  // Country list must include ISO codes (DE/IN/US...) for libphonenumber-js
  const COUNTRY_CODES = [
    { iso: "DE", code: "+49", label: "Germany", flag: "🇩🇪" },
    { iso: "IN", code: "+91", label: "India", flag: "🇮🇳" },
    { iso: "US", code: "+1", label: "USA", flag: "🇺🇸" },
    { iso: "GB", code: "+44", label: "UK", flag: "🇬🇧" },
    { iso: "AE", code: "+971", label: "UAE", flag: "🇦🇪" },
  ];

  //  Display this to user (what special characters are allowed)
  const ALLOWED_SPECIALS =
    `! @ # $ % ^ & * ( ) _ + - = [ ] { } ; : ' " , . ? / \\ | \` ~ < >`;

  //  Registration form state
  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryIso: "DE",
    countryCode: "+49",
    phoneNumber: "", // user types national number (digits), we validate per selected country
    password: "",
  });

  //  Login form state
  const [login, setLogin] = useState({
    identifier: "", // can be email OR international phone (+...)
    password: "",
  });

  //  Toast helper
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2400);
  };

  // -------------------------
  //  Validation helpers
  // -------------------------
  const isValidName = (name) => /^[A-Za-z ]{2,40}$/.test(name.trim());

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  //  For login: allow international phone format OR email
  // Example: +4915123456789
  const isValidIdentifier = (value) => {
    const v = value.trim();
    return isValidEmail(v) || /^\+\d{7,15}$/.test(v);
  };

  // Password rules:
  // - at least 6 characters
  // - must include 1 letter, 1 number, 1 special char from allowed set
  const validatePassword = (pw) => {
    if (!pw || pw.length < 6) return "Password must be at least 6 characters.";

    const hasLetter = /[A-Za-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};:'",.?/\\|`~<>]/.test(pw);

    if (!hasLetter) return "Password must include at least 1 letter (A–Z).";
    if (!hasNumber) return "Password must include at least 1 number (0–9).";
    if (!hasSpecial)
      return `Password must include at least 1 special character. Allowed: ${ALLOWED_SPECIALS}`;

    return "";
  };

  // Phone validation based on selected country
  // We parse the national number using the selected ISO code, then check validity.
  // If valid, we store E.164 format (best): +4915123456789
  const validatePhoneByCountry = (countryIso, nationalNumber) => {
    const digits = (nationalNumber || "").replace(/[^\d]/g, "");
    if (!digits) return { ok: false, message: "Please enter your phone number." };

    const phone = parsePhoneNumberFromString(digits, countryIso);
    if (!phone)
      return {
        ok: false,
        message: "Phone number format looks invalid for the selected country.",
      };

    if (!phone.isValid())
      return {
        ok: false,
        message: "Invalid phone number for the selected country.",
      };

    return { ok: true, e164: phone.number }; // Example: +4915123456789
  };

  // -------------------------
  // Register handler
  // -------------------------
  const handleRegister = (e) => {
    e.preventDefault();

    // Validate names/email
    if (!isValidName(reg.firstName))
      return showToast("Please enter a valid First Name (letters only).");
    if (!isValidName(reg.lastName))
      return showToast("Please enter a valid Last Name (letters only).");
    if (!isValidEmail(reg.email))
      return showToast("Please enter a valid Email ID.");

    // Validate phone based on selected country
    const phoneCheck = validatePhoneByCountry(reg.countryIso, reg.phoneNumber);
    if (!phoneCheck.ok) return showToast(phoneCheck.message);

    //  Validate password
    const pwError = validatePassword(reg.password);
    if (pwError) return showToast(pwError);

    //  Store data in localStorage (for demo only)
    // WHERE IT IS STORED:
    // - localStorage key: "dietify_user"
    // WHAT IS STORED:
    // - email, phone (E.164), password, and profile fields
    // HOW LOGIN USES IT:
    // - login.identifier must match saved.email OR saved.phone
    // - login.password must match saved.password
    localStorage.setItem(
      "dietify_user",
      JSON.stringify({
        firstName: reg.firstName.trim(),
        lastName: reg.lastName.trim(),
        email: reg.email.trim(),
        phone: phoneCheck.e164, //  store phone as E.164
        password: reg.password,
        gender,
      })
    );

    showToast("Profile created! Now login.");

    //  Switch to login mode
    setMode("login");
    setLogin({ identifier: reg.email.trim(), password: "" });
  };

  // -------------------------
  // Login handler
  // -------------------------
  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidIdentifier(login.identifier))
      return showToast("Enter a valid Email or Phone (Example: +4915123456789).");

    const pwError = validatePassword(login.password);
    if (pwError) return showToast(pwError);

    //  Read stored profile
    const saved = JSON.parse(localStorage.getItem("dietify_user") || "null");
    if (!saved) return showToast("No profile found. Please sign up first.");

    // Compare identifier with saved email OR saved phone
    const id = login.identifier.trim();
    const okId = id === saved.email || id === saved.phone;

    //  Compare password
    const okPw = login.password === saved.password;

    if (!okId || !okPw) return showToast("Incorrect credentials. Please try again.");

    showToast("Login successful ");

    // Go to steps page after login
    setTimeout(() => {
      navigate("/steps");
    }, 1000);
  };

  // -------------------------
  //  UI
  // -------------------------
  return (
    <div className="reg-page">
      {toast.show && <div className="reg-toast">{toast.message}</div>}

      <header className="reg-topbar">
        <div className="reg-brand">
          <span className="reg-brand-black">HEALTHY</span>
          <span className="reg-brand-blue">BODY</span>
        </div>
      </header>

      <div className="reg-wrap">
        <div className="reg-card">
          <h1 className="reg-title">{mode === "register" ? "Create Profile" : "Login"}</h1>

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

          {/* ------------------------- */}
          {/* SIGN UP FORM */}
          {/* ------------------------- */}
          {mode === "register" && (
            <form className="reg-form" onSubmit={handleRegister}>
              <label className="reg-label">
                First Name
                <input
                  className="reg-input"
                  value={reg.firstName}
                  onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                  placeholder="" 
                />
              </label>

              <label className="reg-label">
                Last Name
                <input
                  className="reg-input"
                  value={reg.lastName}
                  onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                  placeholder="" 
                />
              </label>

              <label className="reg-label">
                Email ID
                <input
                  className="reg-input"
                  value={reg.email}
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  placeholder="" 
                />
              </label>

              <label className="reg-label">
                Phone
                {/*  Country select + flag */}
                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    className="reg-input"
                    style={{ width: 170 }}
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

                  {/* national number input (digits only), validated per selected country */}
                  <input
                    className="reg-input"
                    value={reg.phoneNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^\d]/g, "");
                      setReg({ ...reg, phoneNumber: digitsOnly });
                    }}
                    placeholder="" 
                    inputMode="numeric"
                  />
                </div>

                <small className="reg-hint">
                 
                  (example: <strong>+4915123456789</strong>).
                </small>
              </label>

              <label className="reg-label">
                Password (min 6 characters)
                <input
                  className="reg-input"
                  value={reg.password}
                  onChange={(e) => setReg({ ...reg, password: e.target.value })}
                  placeholder="" 
                />
                <small className="reg-hint">
                  {/* Must include: <strong>1 letter</strong>, <strong>1 number</strong>, and <strong>1 special</strong>.
                  <br />
                  Allowed special characters: <strong>{ALLOWED_SPECIALS}</strong> */}
                </small>
              </label>

              <button className="reg-primary" type="submit">
                Create Profile
              </button>
            </form>
          )}

          {/* ------------------------- */}
          {/*  LOGIN FORM */}
          {/* ------------------------- */}
          {mode === "login" && (
            <form className="reg-form" onSubmit={handleLogin}>
              <label className="reg-label">
                Email or Phone
                <input
                  className="reg-input"
                  value={login.identifier}
                  onChange={(e) => setLogin({ ...login, identifier: e.target.value })}
                  placeholder="" 
                />
                <small className="reg-hint">
                  Phone login must be in international format like <strong>+4915123456789</strong>.
                </small>
              </label>

              <label className="reg-label">
                Password
                <input
                  className="reg-input"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  placeholder="" 
                />
                <small className="reg-hint">
                  Must include: <strong>1 letter</strong>, <strong>1 number</strong>, and <strong>1 special</strong>.
                  <br />
                  Allowed special characters: <strong>{ALLOWED_SPECIALS}</strong>
                </small>
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