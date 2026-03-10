import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuth } from "../hooks/useAuth";
import { createLocalUser, validateLocalLogin } from "../utils/auth";
import { clearUserProfile } from "../store/slices/userSlice";
import { clearResults } from "../store/slices/resultSlice";
import { clearCart } from "../store/slices/cartSlice";
import { clearAiData } from "../store/slices/aiSlice";

import "../styles/Registration.css";

export default function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login, logout, deleteProfile, currentUser, isAuthenticated } = useAuth();

  const [mode, setMode] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formHeading = useMemo(() => {
    return mode === "register"
      ? "Create your Dietify profile"
      : "Welcome back to Dietify";
  }, [mode]);

  const formSubheading = useMemo(() => {
    return mode === "register"
      ? "Create your access profile to continue toward personalized weekly meal planning."
      : "Log in to continue to your personalized nutrition planner.";
  }, [mode]);

  function validateName(name) {
    if (!name.trim()) return "Please enter your full name.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
      return "Name can only contain letters and basic punctuation.";
    }
    return "";
  }

  function validateEmail(email) {
    if (!email.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    return "";
  }

  function validatePassword(password) {
    if (!password.trim()) return "Please enter your password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
    if (!/\d/.test(password)) return "Include at least one number.";
    if (!/[!@#$%^&*(),.?\":{}|<>_\-\\[\]/+=~`]/.test(password)) {
      return "Include at least one special character.";
    }
    return "";
  }

  function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword.trim()) return "Please confirm your password.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  }

  function getFieldError(name, value, currentData) {
    if (name === "fullName") return validateName(value);
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    if (name === "confirmPassword") {
      return validateConfirmPassword(currentData.password, value);
    }
    return "";
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    const updatedData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(updatedData);
    setError("");
    setSuccessMessage("");

    if (type !== "checkbox") {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: getFieldError(name, value, updatedData),
        ...(name === "password" && mode === "register"
          ? {
              confirmPassword: getFieldError(
                "confirmPassword",
                updatedData.confirmPassword,
                updatedData
              ),
            }
          : {}),
      }));
    }
  }

  function validateRegisterForm() {
    const errors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };

    setFieldErrors(errors);

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      setError("Please correct the highlighted fields.");
      return false;
    }

    return true;
  }

  function validateLoginForm() {
    const errors = {
      email: validateEmail(formData.email),
      password: formData.password.trim() ? "" : "Please enter your password.",
    };

    setFieldErrors(errors);

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      setError("Please correct the highlighted fields.");
      return false;
    }

    return true;
  }

  async function handleRegister(event) {
    event.preventDefault();
    if (!validateRegisterForm()) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const existingUserRaw = localStorage.getItem("dietify_registered_user");
      if (existingUserRaw) {
        const existingUser = JSON.parse(existingUserRaw);
        if (existingUser.email === formData.email) {
          setError("An account with this email already exists. Please log in instead.");
          return;
        }
      }

      await createLocalUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      setSuccessMessage("Registration successful. You can now log in to continue.");
      setMode("login");
      setFieldErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (registerError) {
      console.error("Registration failed:", registerError);
      setError("Something went wrong while creating your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!validateLoginForm()) return;

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const validatedUser = await validateLocalLogin(
        formData.email,
        formData.password
      );

      if (!validatedUser) {
        setError("Invalid email or password.");
        return;
      }

      login(validatedUser, formData.rememberMe);
      setSuccessMessage("Login successful.");
      navigate("/user-input");
    } catch (loginError) {
      console.error("Login failed:", loginError);
      setError("Something went wrong while logging in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    logout();
    dispatch(clearUserProfile());
    dispatch(clearResults());
    dispatch(clearCart());
    dispatch(clearAiData());
    setSuccessMessage("You have been logged out.");
    setError("");
  }

  function handleDeleteProfile() {
    deleteProfile();
    dispatch(clearUserProfile());
    dispatch(clearResults());
    dispatch(clearCart());
    dispatch(clearAiData());

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
    setFieldErrors({});
    setMode("register");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSuccessMessage("Local profile deleted.");
    setError("");
  }

  return (
    <main className="registration-page">
      <section className="registration-shell">
        <section className="registration-layout glass-card">
          <div className="registration-aside">
            <span className="registration-badge">Dietify Access</span>
            <h1>{formHeading}</h1>
            <p className="registration-aside__text">{formSubheading}</p>

            <div className="registration-benefits">
              <article className="registration-benefit glass-panel">
                <strong>Profile-first</strong>
                <span>Set up your access and continue smoothly.</span>
              </article>

              <article className="registration-benefit glass-panel">
                <strong>Weekly planning</strong>
                <span>Continue toward personalized meal generation.</span>
              </article>

              <article className="registration-benefit glass-panel">
                <strong>Smart shopping</strong>
                <span>Move from meals to a cart-ready ingredient flow.</span>
              </article>
            </div>
          </div>

          <div className="registration-card">
            <div className="registration-toggle">
              <button
                type="button"
                className={mode === "register" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMessage("");
                  setFieldErrors({});
                  setShowPassword(false);
                  setShowConfirmPassword(false);
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
                  setFieldErrors({});
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
              >
                Login
              </button>
            </div>

            {isAuthenticated && currentUser ? (
              <div className="session-box">
                <p>
                  Logged in as <strong>{currentUser.fullName || currentUser.email}</strong>
                </p>

                <div className="session-box__actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/user-input")}
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
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
                noValidate
              >
                {mode === "register" && (
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={fieldErrors.fullName ? "input-error" : ""}
                    />
                    {fieldErrors.fullName && (
                      <p className="field-error">{fieldErrors.fullName}</p>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={fieldErrors.email ? "input-error" : ""}
                  />
                  {fieldErrors.email && (
                    <p className="field-error">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-field">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete={
                        mode === "register" ? "new-password" : "current-password"
                      }
                      className={fieldErrors.password ? "input-error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="field-error">{fieldErrors.password}</p>
                  )}
                </div>

                {mode === "register" && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-field">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={fieldErrors.confirmPassword ? "input-error" : ""}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="field-error">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                <label className="remember-row">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me on this browser</span>
                </label>

                {error && <p className="form-message form-message--error">{error}</p>}
                {successMessage && (
                  <p className="form-message form-message--success">{successMessage}</p>
                )}

                <div className="registration-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Please wait..."
                      : mode === "register"
                      ? "Create Account"
                      : "Login"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/home")}
                  >
                    Back to Home
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}