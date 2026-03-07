import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Logo.css";

export default function Logo() {
  const navigate = useNavigate();

  // Automatically redirect to home after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="logo-page">
      <div className="logo-container">

        {/* App Logo */}
        <div className="logo-icon">
          🥗
        </div>

        {/* App Name */}
        <h1 className="logo-title">
          Dietify
        </h1>

        {/* Tagline */}
        <p className="logo-subtitle">
          Smart Diet Planning & Personalized Nutrition
        </p>

        {/* Loading indicator */}
        <div className="logo-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>

      </div>
    </main>
  );
}