import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Logo from "./pages/Logo";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Registration from "./pages/Registration";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Logo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
}