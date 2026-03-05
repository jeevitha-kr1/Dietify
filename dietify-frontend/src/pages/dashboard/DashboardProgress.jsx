import { useMemo } from "react";

const INPUT_KEY = "dietify_user_inputs_v1";

function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(INPUT_KEY) || "{}")?.answers || {};
  } catch {
    return {};
  }
}

export default function DashboardProgress() {
  const answers = useMemo(() => getAnswers(), []);

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <h1 className="dash-h1">Progress</h1>
          <p className="dash-sub">Weekly/monthly tracking will be stored in DB next.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-title">Daily steps</div>
          <div className="dash-mini">Onboarding: <b>{answers.steps ?? "Not set"}</b></div>
          <div className="dash-placeholder">Chart placeholder (next: save logs & show charts)</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Sleep</div>
          <div className="dash-mini">Onboarding: <b>{answers.sleep ?? "Not set"}</b></div>
          <div className="dash-placeholder">Chart placeholder</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Water</div>
          <div className="dash-mini">Onboarding: <b>{answers.water ?? "Not set"}</b></div>
          <div className="dash-placeholder">Chart placeholder</div>
        </div>
      </div>
    </div>
  );
}