import { useEffect, useState } from "react";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedChoice = localStorage.getItem("dietify_cookie_choice");
    if (!savedChoice) {
      setVisible(true);
    }
  }, []);

  function handleChoice(choice) {
    localStorage.setItem("dietify_cookie_choice", choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-bar">
      <p>
        We use cookies to improve your experience and save your preferences.
      </p>

      <div className="cookie-bar__actions">
        <button type="button" onClick={() => handleChoice("accept_all")}>
          Accept All
        </button>
        <button type="button" onClick={() => handleChoice("reject_all")}>
          Reject All
        </button>
        <button type="button" onClick={() => handleChoice("essential_only")}>
          Essential Only
        </button>
      </div>
    </div>
  );
}