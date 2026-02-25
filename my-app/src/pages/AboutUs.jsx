// ============================================
// ABOUT US PAGE (PerfectBody-like layout)
// - Masculine/Female buttons
// - ✅ Passes gender to registration
// - ✅ Stores gender in localStorage for refresh safety
// - Cookie bar at bottom
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  // Cookie bar state
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dietify_cookie_choice");
    if (!saved) {
      const t = setTimeout(() => setShowCookies(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const handleCookieChoice = (choice) => {
    localStorage.setItem("dietify_cookie_choice", choice);
    setShowCookies(false);
  };

  // ✅ IMPORTANT: Pass "gender" key AND store it for refresh
  const goToRegistration = (gender) => {
    localStorage.setItem("dietify_selected_gender", gender);
    navigate("/registration", { state: { gender } });
  };

  return (
    <div className="pb-page">
      {/* Top brand */}
      <header className="pb-topbar">
        <div className="pb-brand">
          <span className="pb-brand-black">HEALTHY</span>
          <span className="pb-brand-blue">BODY</span>
        </div>
      </header>

      {/* Hero */}
      <main className="pb-hero">
        {/* Left */}
        <section className="pb-left">
          <h1 className="pb-title">
            Real results, real <br />
            food, it&apos;s that <br />
            simple.
          </h1>

          <p className="pb-subtitle">
            Dietify makes your nutrition journey easier than you think.
            All you need is a personalized plan and the willingness to take the first step.
          </p>

          <div className="pb-choose">
            <p className="pb-label">CHOOSE YOUR GENDER</p>

            <div className="pb-btn-row">
              <button
                className="pb-pill"
                onClick={() => goToRegistration("Masculine")}
                type="button"
              >
                Masculine
              </button>

              <button
                className="pb-pill"
                onClick={() => goToRegistration("Female")}
                type="button"
              >
                Female
              </button>
            </div>
          </div>
        </section>

        {/* Right visuals */}
        <section className="pb-right" aria-hidden="true">
          <div className="pb-globe" />

          <div className="pb-bubble b1 ring-yellow">
            <div className="pb-bubble-inner">🥗</div>
          </div>

          <div className="pb-bubble b2 ring-pink">
            <div className="pb-bubble-inner pb-person">
              <div className="pb-avatar">S</div>
            </div>
          </div>

          <div className="pb-bubble b3 ring-green">
            <div className="pb-bubble-inner pb-person">
              <div className="pb-avatar">M</div>
            </div>
          </div>

          <div className="pb-bubble b4 ring-blue">
            <div className="pb-bubble-inner">🍳</div>
          </div>

          <div className="pb-bubble b5 ring-lilac">
            <div className="pb-bubble-inner">🍣</div>
          </div>

          <div className="pb-bubble b6 ring-yellow">
            <div className="pb-bubble-inner">🥑</div>
          </div>

          <span className="pb-heart h1">❤</span>
          <span className="pb-heart h2">❤</span>
          <span className="pb-heart h3">❤</span>
          <span className="pb-heart h4">❤</span>
        </section>
      </main>

      {/* Cookie bar */}
      {showCookies && (
        <div className="pb-cookie">
          <p className="pb-cookie-text">
            We use cookies to enhance your experience, personalize content, and analyze traffic.
            Manage preferences in Settings.
          </p>

          <div className="pb-cookie-actions">
            <button
              className="pb-cookie-link"
              onClick={() => alert("Settings UI coming soon 🙂")}
              type="button"
            >
              Settings
            </button>

            <button
              className="pb-cookie-btn pb-cookie-reject"
              onClick={() => handleCookieChoice("rejected")}
              type="button"
            >
              Reject
            </button>

            <button
              className="pb-cookie-btn pb-cookie-accept"
              onClick={() => handleCookieChoice("accepted")}
              type="button"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}