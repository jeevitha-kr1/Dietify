import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <p className="app-footer__brand">Dietify © 2026</p>

        <nav className="app-footer__links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}