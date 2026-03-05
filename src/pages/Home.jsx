import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <div className="hm-hero" data-cy="home-page">
      <div className="hm-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <header className="hm-topbar">
        <button
          className="hm-brand"
          type="button"
          onClick={() => navigate("/home")}
          aria-label="Go to home"
          data-cy="home-brand"
        >
          <div className="hm-logo" aria-hidden="true">🥗</div>
          <div>
            <div className="hm-name">Dietify</div>
            <div className="hm-tag">Diet recommendation & planning</div>
          </div>
        </button>

        <nav className="hm-nav" aria-label="Primary navigation">
          <button
            className="hm-nav-btn"
            type="button"
            onClick={() => navigate("/about")}
            data-cy="nav-about"
          >
            About
          </button>
          <button
            className="hm-nav-btn"
            type="button"
            onClick={() => navigate("/registration")}
            data-cy="nav-login"
          >
            Login
          </button>
        </nav>
      </header>

      <main className="hm-center">
        <div className="hm-card" data-cy="home-hero-card">
          <div className="hm-kicker">Minimal • Personalized • Practical</div>

          <h1 className="hm-title">Build a better food routine.</h1>

          <p className="hm-subtitle">
            Dietify helps you choose meals that match your goal and plan them in a way you can actually follow.
          </p>

          <div className="hm-points">
            <div className="hm-point">🎯 Recommendations tailored to you</div>
            <div className="hm-point">🗓️ Weekly planning, not confusion</div>
            <div className="hm-point">📈 Track progress over time</div>
          </div>

          <button
            className="hm-primary"
            type="button"
            onClick={() => navigate("/registration")}
            data-cy="cta-create-profile"
          >
            Create profile
          </button>

          <button
            className="hm-link"
            type="button"
            onClick={() => navigate("/about")}
            data-cy="cta-why-dietify"
          >
            Why Dietify →
          </button>
        </div>
      </main>

      <footer className="hm-footer">© {year} Dietify</footer>
    </div>
  );
}