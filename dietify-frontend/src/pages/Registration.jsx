import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "../hooks/useAuth";
import { createLocalUser, validateLocalLogin } from "../utils/auth";
import { loginUser, logoutUser } from "../store/slices/authSlice";
import { clearUserProfile } from "../store/slices/userSlice";
import { clearResults } from "../store/slices/resultSlice";
import { clearCart } from "../store/slices/cartSlice";
import { clearAiData } from "../store/slices/aiSlice";

import "../styles/Registration.css";

export default function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { login, logout, deleteProfile, currentUser, isAuthenticated } = useAuth();

  // Toggle between register and login form
  const [mode, setMode] = useState("register");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  // UI feedback state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-calculate simple form labels based on current mode
  const formHeading = useMemo(() => {
    return mode === "register" ? "Create your Dietify profile" : "Welcome back to Dietify";
  }, [mode]);

  const formSubheading = useMemo(() => {
    return mode === "register"
      ? "Create an account to save your nutrition journey and continue to your personalized diet plan."
      : "Log in to continue to your personalized nutrition planner.";
  }, [mode]);

  // Handle text / checkbox field updates
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccessMessage("");
  }

  // Basic form validation
  function validateRegisterForm() {
    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    return true;
  }

  function validateLoginForm() {
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password.");
      return false;
    }

    return true;
  }

  // Register demo user locally with hashed password
  async function handleRegister(event) {
    event.preventDefault();

    const isValid = validateRegisterForm();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      // Prevent overwriting an already registered demo profile accidentally
      const existingUserRaw = localStorage.getItem("dietify_registered_user");

      if (existingUserRaw) {
        const existingUser = JSON.parse(existingUserRaw);

        if (existingUser.email === formData.email) {
          setError("An account with this email already exists. Please log in instead.");
          return;
        }
      }

      await createLocalUser(formData);

      setSuccessMessage("Registration successful. You can now log in to continue.");
      setMode("login");

      // Keep email for login convenience, clear password
      setFormData((previous) => ({
        ...previous,
        password: "",
      }));
    } catch (registerError) {
      console.error("Registration failed:", registerError);
      setError("Something went wrong while creating your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Validate demo login and start auth session
  async function handleLogin(event) {
    event.preventDefault();

    const isValid = validateLoginForm();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const validatedUser = await validateLocalLogin(formData.email, formData.password);

      if (!validatedUser) {
        setError("Invalid email or password.");
        return;
      }

      // Save session in AuthContext
      login(validatedUser, formData.rememberMe);

      // Mirror basic login info in Redux auth slice
      dispatch(loginUser(validatedUser.email));

      setSuccessMessage("Login successful.");

      navigate("/user-input");
    } catch (loginError) {
      console.error("Login failed:", loginError);
      setError("Something went wrong while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Logout current session only
  function handleLogout() {
    logout();
    dispatch(logoutUser());
    dispatch(clearUserProfile());
    dispatch(clearResults());
    dispatch(clearCart());
    dispatch(clearAiData());

    setSuccessMessage("You have been logged out.");
    setError("");
  }

  // Delete local demo profile and clear all app state
  function handleDeleteProfile() {
    deleteProfile();
    dispatch(logoutUser());
    dispatch(clearUserProfile());
    dispatch(clearResults());
    dispatch(clearCart());
    dispatch(clearAiData());

    setFormData({
      fullName: "",
      email: "",
      password: "",
      rememberMe: false,
    });

    setMode("register");
    setSuccessMessage("Local demo profile deleted.");
    setError("");
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <div className="registration-header">
          <p className="registration-kicker">Dietify Access</p>
          <h1>{formHeading}</h1>
          <p className="registration-subtitle">{formSubheading}</p>
        </div>

        {/* Mode toggle */}
        <div className="registration-toggle">
          <button
            type="button"
            className={mode === "register" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => {
              setMode("register");
              setError("");
              setSuccessMessage("");
            }}
          >
            Register
          </button>

          <button
            type="button"
            className={mode === "login" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMessage("");
            }}
          >
            Login
          </button>
        </div>

        {/* Current user status */}
        {isAuthenticated && currentUser ? (
          <div className="session-box">
            <p>
              Logged in as <strong>{currentUser.fullName || currentUser.email}</strong>
            </p>

            <div className="session-box__actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => navigate("/user-input")}
              >
                Continue
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </button>
            </div>
          </div>
        ) : (
          <form
            className="registration-form"
            onSubmit={mode === "register" ? handleRegister : handleLogin}
          >
            {mode === "register" ? (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            ) : null}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <label className="remember-row">
              <input
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me on this browser</span>
            </label>

            {error ? <p className="form-message form-message--error">{error}</p> : null}
            {successMessage ? (
              <p className="form-message form-message--success">{successMessage}</p>
            ) : null}

            <div className="registration-actions">
              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? "Please wait..."
                  : mode === "register"
                  ? "Create Account"
                  : "Login"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}