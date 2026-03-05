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

  // ✅ NavLink active styling
  const linkClass = ({ isActive }) => `dash-link ${isActive ? "active" : ""}`;

  return (
    <div className="dash-hero">
      <div className="dash-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <div className="dash-shell">
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <button className="dash-brand" type="button" onClick={() => navigate("/dashboard")}>
              <span className="dash-brand-icon" aria-hidden="true">🥗</span>
              <div className="dash-brand-text">
                <div className="dash-brand-name">Dietify</div>
                <div className="dash-brand-sub">Personal Dashboard</div>
              </div>
            </button>

            <nav className="dash-nav">
              <NavLink to="/dashboard" end className={linkClass}>Overview</NavLink>
              <NavLink to="/dashboard/plan" className={linkClass}>Meal Plan</NavLink>
              <NavLink to="/dashboard/recipes" className={linkClass}>Recipes</NavLink>
              <NavLink to="/dashboard/progress" className={linkClass}>Progress</NavLink>
              <NavLink to="/dashboard/cart" className={linkClass}>Cart</NavLink>
              <NavLink to="/dashboard/settings" className={linkClass}>Settings</NavLink>
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
                <input
                  className="dash-search-input"
                  placeholder="Search recipes, meals, ingredients…"
                />
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
      </div>
    </div>
  );
}