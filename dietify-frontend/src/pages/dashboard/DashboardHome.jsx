import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("dietify_session_active");
    sessionStorage.removeItem("dietify_session_active");
    localStorage.removeItem("dietify_demo_current_user");
    navigate("/registration");
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <button className="dash-brand" type="button" onClick={() => navigate("/dashboard")}>
          <span className="dash-brand-icon">🥗</span>
          <div className="dash-brand-text">
            <div className="dash-brand-name">Dietify</div>
            <div className="dash-brand-sub">Personal Dashboard</div>
          </div>
        </button>

        <nav className="dash-nav">
          <NavLink to="/dashboard" end className="dash-link">
            Overview
          </NavLink>
          <NavLink to="/dashboard/plan" className="dash-link">
            Meal Plan
          </NavLink>
          <NavLink to="/dashboard/recipes" className="dash-link">
            Recipes
          </NavLink>
          <NavLink to="/dashboard/progress" className="dash-link">
            Progress
          </NavLink>
          <NavLink to="/dashboard/cart" className="dash-link">
            Cart
          </NavLink>
          <NavLink to="/dashboard/settings" className="dash-link">
            Settings
          </NavLink>
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-ghost" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-search">
            <input placeholder="Search recipes, meals, ingredients…" />
          </div>

          <div className="dash-actions">
            <button className="dash-ghost" type="button" onClick={() => navigate("/dashboard/settings")}>
              Preferences
            </button>
          </div>
        </header>

        <section className="dash-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}