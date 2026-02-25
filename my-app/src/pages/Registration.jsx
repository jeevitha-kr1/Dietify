// ======================================================
// REGISTRATION PAGE (Create Profile)
// - Reads gender from AboutUs via location.state.gender
// - ✅ Persists gender for refresh using localStorage
// - Same theme as About page
// - No page scroll (fits viewport)
// ======================================================

import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Registration.css";

export default function Registration() {
  const location = useLocation();

  // ✅ gender: state first, then localStorage fallback (refresh-safe)
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

  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [login, setLogin] = useState({
    identifier: "",
    password: "",
  });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2400);
  };

  // validation helpers
  const isValidName = (name) => /^[A-Za-z ]{2,40}$/.test(name.trim());
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const isValidPhone = (phone) => /^\+\d{1,3}\d{10}$/.test(phone.trim());
  const isValidPassword6 = (pw) => /^\d{6}$/.test(pw);
  const isValidIdentifier = (value) => isValidEmail(value) || isValidPhone(value);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!isValidName(reg.firstName)) return showToast("Please enter a valid First Name (letters only).");
    if (!isValidName(reg.lastName)) return showToast("Please enter a valid Last Name (letters only).");
    if (!isValidEmail(reg.email)) return showToast("Please enter a valid Email ID.");
    if (!isValidPhone(reg.phone)) return showToast("Phone must be +<countrycode><10 digits>. Example: +919876543210");
    if (!isValidPassword6(reg.password)) return showToast("Password must be exactly 6 digits (numbers only).");

    localStorage.setItem("dietify_user", JSON.stringify({ ...reg, gender }));
    showToast("Profile created ✅ Now login.");

    setMode("login");
    setLogin({ identifier: reg.email, password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!isValidIdentifier(login.identifier)) return showToast("Enter a valid Email or Phone (+countrycode + 10 digits).");
    if (!isValidPassword6(login.password)) return showToast("Password must be exactly 6 digits.");

    const saved = JSON.parse(localStorage.getItem("dietify_user") || "null");
    if (!saved) return showToast("No profile found. Please sign up first.");

    const okId = login.identifier === saved.email || login.identifier === saved.phone;
    const okPw = login.password === saved.password;

    if (!okId || !okPw) return showToast("Incorrect credentials. Please try again.");

    showToast("Login successful ✅");
  };

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

          <p className="reg-subtitle">
            Selected: <strong>{gender}</strong>
          </p>

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

          {mode === "register" && (
            <form className="reg-form" onSubmit={handleRegister}>
              <label className="reg-label">
                First Name
                <input className="reg-input" value={reg.firstName} onChange={(e) => setReg({ ...reg, firstName: e.target.value })} placeholder="Enter first name" />
              </label>

              <label className="reg-label">
                Last Name
                <input className="reg-input" value={reg.lastName} onChange={(e) => setReg({ ...reg, lastName: e.target.value })} placeholder="Enter last name" />
              </label>

              <label className="reg-label">
                Email ID
                <input className="reg-input" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} placeholder="example@email.com" />
              </label>

              <label className="reg-label">
                Phone (with country code)
                <input className="reg-input" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} placeholder="+4915123456789" />
                <small className="reg-hint">
                  Format: +&lt;countrycode&gt;&lt;10 digits&gt; (Example: +919876543210)
                </small>
              </label>

              <label className="reg-label">
                Password (6 digits)
                <input className="reg-input" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} placeholder="123456" inputMode="numeric" />
              </label>

              <button className="reg-primary" type="submit">Create Profile</button>
            </form>
          )}

          {mode === "login" && (
            <form className="reg-form" onSubmit={handleLogin}>
              <label className="reg-label">
                Email or Phone
                <input className="reg-input" value={login.identifier} onChange={(e) => setLogin({ ...login, identifier: e.target.value })} placeholder="Email or +4915123456789" />
              </label>

              <label className="reg-label">
                Password (6 digits)
                <input className="reg-input" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} placeholder="123456" inputMode="numeric" />
              </label>

              <button className="reg-primary" type="submit">Login</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}