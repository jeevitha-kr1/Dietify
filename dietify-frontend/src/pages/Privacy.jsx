import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";

import "../styles/Legal.css";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <main className="legal-page">
      <section className="legal-card">
        <p className="legal-kicker">Dietify Legal</p>

        <h1>Privacy Policy</h1>

        <p className="legal-intro">
          Dietify is an academic frontend project created for learning and demonstration
          purposes. This version stores limited information locally in the browser to
          support login, questionnaire flow, user preferences, and app functionality.
        </p>

        <div className="legal-content">
          <section>
            <h2>What data is stored</h2>
            <p>
              Dietify may store basic demo account information, questionnaire answers,
              cookie preferences, and temporary session data using browser storage such
              as localStorage and sessionStorage.
            </p>
          </section>

          <section>
            <h2>How the data is used</h2>
            <p>
              The stored data is used only to support the user experience inside the app,
              such as remembering login state, restoring progress, and generating
              personalized nutrition recommendations.
            </p>
          </section>

          <section>
            <h2>OpenAI usage</h2>
            <p>
              The application may send questionnaire-based nutrition information to the
              OpenAI API in order to generate meal suggestions, summaries, and recipe ideas.
              This is part of the project’s AI-assisted functionality.
            </p>
          </section>

          <section>
            <h2>Important note</h2>
            <p>
              This project is not a production medical platform. Users should not treat
              the generated recommendations as medical advice.
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