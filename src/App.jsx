import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Registration from "./pages/Registration";
import UserInput from "./pages/UserInput";
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

        {/* User Input page */}
        <Route path="/steps" element={<UserInput />} />

        {/* Result page */}
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}