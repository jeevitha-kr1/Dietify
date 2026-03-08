import "../styles/Legal.css";

export default function Legal() {
  return (
    <main className="legal-page">
      <section className="page-shell legal-shell">
        <div className="legal-card">
          <p className="legal-kicker">Dietify Legal</p>
          <h1>Privacy Policy & Terms</h1>
          <p className="legal-intro">
            This page explains how Dietify handles user information and the
            terms for using the platform.
          </p>

          <section className="legal-section">
            <h2>Privacy Policy</h2>
            <p>
              Dietify may collect user information such as profile details,
              food preferences, goals, and meal planning inputs in order to
              generate a more personalized experience.
            </p>
            <p>
              Your information is used only for improving meal planning,
              nutrition guidance, and user experience within the application.
            </p>
            <p>
              Dietify does not aim to provide medical advice. Users should
              consult a qualified professional for strict dietary or health
              concerns.
            </p>
          </section>

          <section className="legal-section">
            <h2>Terms & Conditions</h2>
            <p>
              By using Dietify, you agree to use the platform responsibly and
              provide accurate information where required.
            </p>
            <p>
              The meal plans and nutrition suggestions are generated for general
              informational purposes and should not be treated as professional
              medical guidance.
            </p>
            <p>
              Dietify may update features, recommendations, or design elements
              over time to improve the product experience.
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact</h2>
            <p>
              For questions about privacy, terms, or the platform, users can
              contact the Dietify team through the official support channel or
              project contact details.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}