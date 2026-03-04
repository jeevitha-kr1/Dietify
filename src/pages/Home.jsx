import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hm-hero">
      <div className="hm-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <header className="hm-topbar">
        <div className="hm-brand" role="button" tabIndex={0} onClick={() => navigate("/home")}>
          <div className="hm-logo">🥗</div>
          <div>
            <div className="hm-name">Dietify</div>
            <div className="hm-tag">Diet recommendation & planning</div>
          </div>
        </div>

        <nav className="hm-nav">
          <button className="hm-nav-btn" type="button" onClick={() => navigate("/about")}>
            About
          </button>
          <button className="hm-nav-btn" type="button" onClick={() => navigate("/registration")}>
            Login
          </button>
        </nav>
      </header>

      <main className="hm-center">
        <div className="hm-card">
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

          <button className="hm-primary" type="button" onClick={() => navigate("/registration")}>
            Create profile
          </button>

          <button className="hm-link" type="button" onClick={() => navigate("/about")}>
            Why Dietify →
          </button>
        </div>
      </main>

      <footer className="hm-footer">© {new Date().getFullYear()} Dietify</footer>
    </div>
  );
}