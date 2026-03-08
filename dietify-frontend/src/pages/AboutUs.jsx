import { Link, useNavigate } from "react-router-dom";
import CookieBar from "../components/common/CookieBar";
import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <main className="about-page">
      <section className="page-shell about-shell">
        <section className="about-hero glass-card">
          <span className="about-badge">Why Dietify</span>

          <h1 className="about-title">
            Personalized nutrition with a cleaner, smarter experience.
          </h1>

          <p className="about-description">
            Dietify is designed to turn personal health inputs into a practical
            weekly plan, helpful nutrition insight, and a shopping-ready flow
            that feels smooth from start to finish.
          </p>

          <div className="about-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/registration")}
            >
              Start Now
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/home")}
            >
              Back Home
            </button>
          </div>
        </section>

        <section className="about-grid">
          <article className="about-card glass-panel">
            <span className="about-card__icon">🧠</span>
            <h2>Smarter personalization</h2>
            <p>
              Inputs are transformed into a more tailored meal-planning
              experience instead of generic recommendations.
            </p>
          </article>

          <article className="about-card glass-panel">
            <span className="about-card__icon">📅</span>
            <h2>Weekly planning flow</h2>
            <p>
              Meals are structured day by day so the experience feels clearer,
              simpler, and easier to follow.
            </p>
          </article>

          <article className="about-card glass-panel">
            <span className="about-card__icon">🛒</span>
            <h2>Shopping-ready output</h2>
            <p>
              Ingredients can be collected into a cart and exported for a more
              practical lifestyle flow.
            </p>
          </article>
        </section>

        <section className="about-highlight glass-card">
          <div className="about-highlight__content">
            <p className="about-highlight__kicker">Designed for simplicity</p>
            <h2>
              A premium wellness flow from profile creation to planning and
              grocery preparation.
            </h2>
            <p>
              Dietify is built to make healthy planning feel more intentional,
              less overwhelming, and more visually refined across the full user
              journey.
            </p>
          </div>
        </section>

        <footer className="about-footer glass-card">
          <p>Dietify © 2026</p>

          <div className="about-footer-links">
            <Link to="/legal">Privacy & Terms</Link>
          </div>
        </footer>
      </section>

      <CookieBar />
    </main>
  );
}