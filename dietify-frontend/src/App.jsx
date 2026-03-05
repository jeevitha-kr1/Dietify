import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Logo from "./pages/Logo";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Registration from "./pages/Registration";
import UserInput from "./pages/UserInput";

// NEW
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardPlan from "./pages/dashboard/DashboardPlan";
import DashboardRecipes from "./pages/dashboard/DashboardRecipes";
import DashboardProgress from "./pages/dashboard/DashboardProgress";
import DashboardCart from "./pages/dashboard/DashboardCart";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Logo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/user-input" element={<UserInput />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="plan" element={<DashboardPlan />} />
          <Route path="recipes" element={<DashboardRecipes />} />
          <Route path="progress" element={<DashboardProgress />} />
          <Route path="cart" element={<DashboardCart />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}