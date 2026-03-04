import { useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="au-hero">
      <div className="au-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <header className="au-topbar">
        <div className="au-brand" role="button" tabIndex={0} onClick={() => navigate("/home")}>
          <div className="au-logo">🥗</div>
          <div>
            <div className="au-name">Dietify</div>
            <div className="au-tag">About</div>
          </div>
        </div>

        <nav className="au-nav">
          <button className="au-nav-btn" type="button" onClick={() => navigate("/home")}>
            Home
          </button>
          <button className="au-nav-primary" type="button" onClick={() => navigate("/registration")}>
            Start
          </button>
        </nav>
      </header>

      <main className="au-center">
        <div className="au-card">
          <div className="au-kicker">Our idea</div>

          <h1 className="au-title">Healthy choices should feel easy.</h1>

          <p className="au-subtitle">
            Dietify is built to reduce decision fatigue around food. Instead of forcing perfection,
            it focuses on realistic routines — recommendations, planning, and tracking that fit your lifestyle.
          </p>

          <div className="au-section">
            <h3>What Dietify stands for</h3>
            <ul>
              <li><strong>Clarity:</strong> simple planning, no clutter</li>
              <li><strong>Consistency:</strong> small steps that last</li>
              <li><strong>Personalization:</strong> suggestions based on your goal</li>
            </ul>
          </div>

          <div className="au-section">
            <h3>Privacy (demo)</h3>
            <p>
              In this project build, your login data is stored locally for testing. In a real product,
              it would be secured on a backend with proper authentication.
            </p>
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

      <footer className="au-footer">© {new Date().getFullYear()} Dietify</footer>
    </div>
  );
}