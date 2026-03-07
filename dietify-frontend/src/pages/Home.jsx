import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";
import CookieBar from "../components/common/CookieBar";

import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      {/* Hero section */}
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-kicker">Personalized nutrition planning</p>

          <h1 className="home-title">
            Welcome to <span>Dietify</span>
          </h1>

          <p className="home-description">
            Build a healthier lifestyle with a smart diet planning and recommendation
            experience that gives you BMI insights, calorie targets, macro guidance,
            meal suggestions, recipes, and a downloadable ingredient cart.
          </p>

          <div className="home-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/about")}
            >
              About Us
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/registration")}
            >
              Login
            </button>
          </div>
        </div>

        {/* Decorative preview card section */}
        <div className="home-preview">
          <article className="home-preview-card">
            <p className="preview-label">What Dietify gives you</p>

            <div className="preview-item">
              <span className="preview-icon">⚖️</span>
              <div>
                <h3>BMI Insights</h3>
                <p>Understand your body status with simple health indicators.</p>
              </div>
            </div>

            <div className="preview-item">
              <span className="preview-icon">🔥</span>
              <div>
                <h3>Calories & Macros</h3>
                <p>Get daily calorie goals and macro breakdown for your target.</p>
              </div>
            </div>

            <div className="preview-item">
              <span className="preview-icon">🍽️</span>
              <div>
                <h3>Meal Planning</h3>
                <p>Receive personalized meals and recipe ideas based on your input.</p>
              </div>
            </div>

            <div className="preview-item">
              <span className="preview-icon">🛒</span>
              <div>
                <h3>Smart Ingredient Cart</h3>
                <p>Add recipe ingredients directly and export them as Excel or PDF.</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="home-features">
        <article className="feature-box">
          <div className="feature-box__icon">🎯</div>
          <h2>Goal-based planning</h2>
          <p>
            Whether your goal is fat loss, muscle gain, or maintenance, Dietify
            adapts recommendations to your needs.
          </p>
        </article>

        <article className="feature-box">
          <div className="feature-box__icon">🥗</div>
          <h2>Personalized food choices</h2>
          <p>
            Respect diet preference, health conditions, and allergies while
            building a plan that feels practical and realistic.
          </p>
        </article>

        <article className="feature-box">
          <div className="feature-box__icon">📄</div>
          <h2>Export-ready experience</h2>
          <p>
            Turn meal planning into action by exporting your shopping list and
            taking it with you while shopping.
          </p>
        </article>
      </section>

      {/* Bottom CTA */}
      <section className="home-cta">
        <div className="home-cta__card">
          <h2>Start your nutrition journey with clarity.</h2>
          <p>
            Create your profile, answer a few simple questions, and let Dietify
            guide your next meal decisions.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/registration")}
          >
            Get Started
          </button>
        </div>
      </section>

      <Footer />
      <CookieBar />
    </main>
  );
}