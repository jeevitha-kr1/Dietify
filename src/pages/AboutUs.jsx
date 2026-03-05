import { useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <div className="au-hero" data-cy="about-page">
      <div className="au-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <header className="au-topbar">
        <button
          className="au-brand"
          type="button"
          onClick={() => navigate("/home")}
          aria-label="Go to home"
        >
          <div className="au-logo" aria-hidden="true">🥗</div>
          <div>
            <div className="au-name">Dietify</div>
            <div className="au-tag">About</div>
          </div>
        </button>

        <nav className="au-nav" aria-label="Primary navigation">
          <button className="au-nav-btn" type="button" onClick={() => navigate("/home")}>
            Home
          </button>
          <button className="au-nav-primary" type="button" onClick={() => navigate("/registration")}>
            Get started
          </button>
        </nav>
      </header>

      <main className="au-center">
        <div className="au-card">
          <div className="au-kicker">What Dietify does</div>

          <h1 className="au-title">Personalized eating, made practical.</h1>

          <p className="au-subtitle">
            Dietify helps you plan and follow a routine that matches your goals — without making nutrition feel confusing.
            It focuses on smart suggestions, clear planning, and simple tracking.
          </p>

          <div className="au-section">
            <h3>Personalized recommendations</h3>
            <ul>
              <li>Goal-based meal suggestions (lose, maintain, gain)</li>
              <li>Recipes selected to match your preferences and time</li>
              <li>Macro-focused recommendations for balanced eating</li>
            </ul>
          </div>

          <div className="au-section">
            <h3>Meal planning that fits your lifestyle</h3>
            <ul>
              <li>Weekly or monthly meal plans (you choose)</li>
              <li>Flexible plans — adjust meals anytime</li>
              <li>Smart grocery list generation based on your plan</li>
            </ul>
          </div>

          <div className="au-section">
            <h3>Simple tracking</h3>
            <ul>
              <li>Track activity level and workouts</li>
              <li>Track water intake and daily habits</li>
              <li>Progress tracking over time to stay consistent</li>
            </ul>
          </div>

          <div className="au-actions">
            <button className="au-primary" type="button" onClick={() => navigate("/registration")}>
              Create profile
            </button>
            <button className="au-secondary" type="button" onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <footer className="au-footer">© {year} Dietify</footer>
    </div>
  );
}