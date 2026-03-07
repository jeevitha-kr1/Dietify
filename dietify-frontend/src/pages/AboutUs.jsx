import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";

import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      {/* Hero section */}
      <section className="about-hero">
        <p className="about-kicker">Why Dietify?</p>

        <h1 className="about-title">
          Healthy eating should feel personal, simple, and achievable.
        </h1>

        <p className="about-description">
          Dietify is a diet planning and recommendation application designed to help
          users understand their body needs and turn those needs into practical daily
          decisions. Instead of giving generic suggestions, Dietify creates a more
          personalized experience using your health profile, lifestyle, and food
          preferences.
        </p>
      </section>

      {/* Story-style feature sections */}
      <section className="about-grid">
        <article className="about-card">
          <div className="about-card__icon">⚖️</div>
          <h2>Understand your body better</h2>
          <p>
            Dietify calculates your BMI and presents it in a simple, readable way so
            you can better understand your starting point before building a healthier routine.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">🔥</div>
          <h2>Know your calorie needs</h2>
          <p>
            Based on age, height, weight, activity level, and goal, Dietify estimates
            your daily calorie requirement to support fat loss, muscle gain, or maintenance.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">🥚</div>
          <h2>Get macro guidance</h2>
          <p>
            The app also provides a macro split for protein, carbohydrates, and fats
            so users can move beyond guesswork and plan meals more clearly.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">🍽️</div>
          <h2>Receive personalized meals</h2>
          <p>
            Dietify considers diet preference, cuisine preference, allergies, and
            health conditions to suggest meal ideas and recipes that feel more realistic
            for everyday life.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">🤖</div>
          <h2>AI-assisted meal planning</h2>
          <p>
            With OpenAI integration, Dietify can generate a structured meal plan,
            practical nutrition tips, and recipe suggestions tailored to the user profile.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">🛒</div>
          <h2>Smart ingredient cart</h2>
          <p>
            Instead of saving only recipe names, Dietify adds recipe ingredients to
            the cart. This makes the app more useful because it directly supports the
            user’s next step: shopping.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">📄</div>
          <h2>Export your shopping list</h2>
          <p>
            The ingredient cart can be exported into Excel or PDF, making it easy to
            carry the final shopping list outside the app.
          </p>
        </article>

        <article className="about-card">
          <div className="about-card__icon">✨</div>
          <h2>A complete frontend project</h2>
          <p>
            Dietify brings together React, Redux, Context API, browser storage,
            OpenAI integration, unit testing, and Cypress testing in one complete
            master-level frontend application.
          </p>
        </article>
      </section>

      {/* Final CTA */}
      <section className="about-cta">
        <div className="about-cta__card">
          <h2>Ready to build your personalized diet plan?</h2>
          <p>
            Create your profile, answer a few guided questions, and let Dietify turn
            your information into a practical nutrition plan.
          </p>

          <div className="about-cta__actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/home")}
            >
              Back Home
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/registration")}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}