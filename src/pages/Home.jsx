// ============================================
// HOME PAGE — Intro Screen
// Shows DIETIFY logo then auto-navigates to About page
// ============================================

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // ✅ page css

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Redirect to About page after 4 seconds
    const timer = setTimeout(() => {
      navigate("/about");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="home-container">
      <h1 className="logo-text">DIETIFY</h1>
      <p className="subtitle">Eat Better. Live Better.</p>
    </div>
  );
};

export default Home;