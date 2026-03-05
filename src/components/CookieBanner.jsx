import { useEffect, useState } from "react";
import "../components/CookieBanner.css";

const KEY = "dietify_cookie_consent"; // "accepted" | "rejected"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cb-wrap" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cb-card">
        <div className="cb-title">We value your privacy</div>
        <div className="cb-text">
          Dietify uses essential cookies to keep the app working. With your permission, we may also use
          optional cookies for analytics to improve the experience.
        </div>

        <div className="cb-actions">
          <button className="cb-btn cb-secondary" type="button" onClick={reject} data-cy="cookie-reject">
            Reject non-essential
          </button>
          <button className="cb-btn cb-primary" type="button" onClick={accept} data-cy="cookie-accept">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}