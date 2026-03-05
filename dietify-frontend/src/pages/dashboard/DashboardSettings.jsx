import { useEffect, useState } from "react";

const KEY = "dietify_prefs_v1";

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { theme: "dark", lang: "en" };
  } catch {
    return { theme: "dark", lang: "en" };
  }
}

function savePrefs(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export default function DashboardSettings() {
  const [prefs, setPrefs] = useState(loadPrefs());

  useEffect(() => {
    savePrefs(prefs);

    // Apply theme flag; you can style based on this later
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs]);

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <h1 className="dash-h1">Settings</h1>
          <p className="dash-sub">Preferences, privacy, and account options.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-title">Preferences</div>

          <label className="dash-label">
            Theme
            <select value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>

          <label className="dash-label">
            Language
            <select value={prefs.lang} onChange={(e) => setPrefs({ ...prefs, lang: e.target.value })}>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Account</div>
          <button className="dash-secondary" onClick={() => alert("Password change after JWT backend auth is added.")}>
            Change password
          </button>
          <button className="dash-ghost" onClick={() => alert("Login sessions will come after backend auth.")}>
            Login sessions
          </button>
          <button className="dash-ghost" onClick={() => alert("Logout all devices will come after backend auth.")}>
            Logout all devices
          </button>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Privacy</div>
          <button className="dash-secondary" onClick={() => alert("Export my data will be added with PDF/Excel endpoints.")}>
            Export my data
          </button>
          <button className="dash-ghost" onClick={() => alert("Delete account will be added after backend auth.")}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}