import { useNavigate, Link } from "react-router-dom";
import CookieBar from "../components/common/CookieBar";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="page-shell home-shell">
        <section className="home-hero glass-card">
          <div className="home-hero__glow home-hero__glow--one"></div>
          <div className="home-hero__glow home-hero__glow--two"></div>

          <div className="home-hero__content">
            <span className="home-badge">AI-powered wellness</span>

            <h1 className="home-title">
              Eat better with a plan that feels personal.
            </h1>

            <p className="home-description">
              Dietify helps you generate a weekly meal plan, understand your
              calorie needs, and turn meals into a smart shopping list in one
              clean and guided experience.
            </p>

            <div className="home-actions">
              <button
                className="home-btn home-btn--primary"
                onClick={() => navigate("/registration")}
              >
                Get Started
              </button>

              <button
                className="home-btn home-btn--secondary"
                onClick={() => navigate("/about")}
              >
                Why Dietify
              </button>
            </div>
          </div>

          <div className="home-hero-cards">
            <div className="hero-feature-card">
              <div className="hero-feature-card__icon">🥗</div>
              <div>
                <h3>Personalized weekly meals</h3>
                <p>
                  Generate a practical weekly meal plan based on your profile,
                  body goals, and food preferences.
                </p>
              </div>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-card__icon">📊</div>
              <div>
                <h3>Clear nutrition insights</h3>
                <p>
                  Understand calories, structure, and meal guidance in a
                  simpler way.
                </p>
              </div>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-card__icon">🛒</div>
              <div>
                <h3>Shopping-ready results</h3>
                <p>
                  Turn meals into a grocery list and export it whenever you
                  need.
                </p>
              </div>
            </div>
          </div>
        </section>
        <footer className="home-footer glass-card">
          <p>Dietify © 2026</p>

          <div className="home-footer-links">
            <Link to="/legal">Privacy & Terms</Link>
          </div>
        </footer>
      </section>

      <CookieBar />
    </main>
  );
}