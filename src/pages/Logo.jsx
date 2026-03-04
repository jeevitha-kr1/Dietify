import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logo.css";

export default function Logo() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/home"), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="lg-hero">
      <div className="lg-blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <div className="lg-center">
        <div className="lg-card">
          <div className="lg-mark">🥗</div>
          <div className="lg-word">
            <div className="lg-title">Dietify</div>
            <div className="lg-sub">Diet recommendation & planning</div>
          </div>

          <div className="lg-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="lg-footer">Preparing your experience…</div>
    </div>
  );
}