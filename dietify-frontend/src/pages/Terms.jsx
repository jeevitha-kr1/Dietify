import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";

import "../styles/Legal.css";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-kicker">Dietify Legal</p>

        <h1>Terms and Conditions</h1>

        <p className="legal-intro">
          These terms apply to the academic version of Dietify. By using the app,
          users understand that this is a demonstration project built for educational
          purposes and not a replacement for medical or professional nutritional advice.
        </p>

        <div className="legal-content">
          <section>
            <h2>Educational purpose</h2>
            <p>
              Dietify is designed as a frontend master project showcasing React,
              Redux, Context API, OpenAI integration, browser storage, and testing practices.
            </p>
          </section>

          <section>
            <h2>No medical guarantee</h2>
            <p>
              The health metrics, meal suggestions, and recipes provided in the app are
              informational only. Users should consult qualified professionals for
              medical, nutritional, or health-related decisions.
            </p>
          </section>

          <section>
            <h2>User responsibility</h2>
            <p>
              Users are responsible for checking allergies, ingredient suitability,
              and any health-related restrictions before following recommendations.
            </p>
          </section>

          <section>
            <h2>Project limitations</h2>
            <p>
              Since this is a frontend-only demonstration project, some features rely on
              browser storage and client-side integrations, which are suitable for academic
              demonstration but not for production-grade deployment.
            </p>
          </section>
        </div>

        <div className="legal-actions">
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
            Continue to Dietify
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}