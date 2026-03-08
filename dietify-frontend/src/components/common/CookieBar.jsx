import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("dietify_cookie_consent");
    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  function handleConsent(choice) {
    localStorage.setItem("dietify_cookie_consent", choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookiebar">
      <div className="cookiebar-content glass-card">
        <div className="cookiebar-text">
          <p className="cookiebar-title">Cookie preferences</p>
          <p className="cookiebar-description">
            Dietify uses cookies to remember your preferences and improve your
            experience. Read our <Link to="/legal">Privacy & Terms</Link>.
          </p>
        </div>

        <div className="cookiebar-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn--ghost"
            onClick={() => handleConsent("essential_only")}
          >
            Essential Only
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn--secondary"
            onClick={() => handleConsent("rejected")}
          >
            Reject
          </button>

          <button
            type="button"
            className="cookie-btn cookie-btn--primary"
            onClick={() => handleConsent("accepted")}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}