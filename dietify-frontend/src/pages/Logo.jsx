import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logo.css";

export default function Logo() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="logo-page">
      <div className="logo-container">
        <h1 className="logo-title">Dietify</h1>
        <p className="logo-subtitle">Personalized nutrition made simple</p>

        <div className="logo-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </main>
  );
}