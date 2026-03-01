import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Registration from "./pages/Registration";
import SevenSteps from "./pages/SevenSteps";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Intro screen */}
        <Route path="/" element={<Home />} />

        {/* About page */}
        <Route path="/about" element={<AboutUs />} />

        {/* Registration page */}
        <Route path="/registration" element={<Registration />} />

        {/* 7 steps */}
        <Route path="/steps" element={<SevenSteps />} />

        {/* Result page */}
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}