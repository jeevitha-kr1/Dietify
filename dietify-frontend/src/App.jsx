import { Navigate, Route, Routes } from "react-router-dom";

import Logo from "./pages/Logo";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Registration from "./pages/Registration";
import UserInput from "./pages/UserInput";
import Result from "./pages/Result";
import Cart from "./pages/Cart";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";


import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
     
      <Route path="/" element={<Logo />} />

    
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

  /
      <Route
        path="/user-input"
        element={
          <ProtectedRoute>
            <UserInput />
          </ProtectedRoute>
        }
      />
{/* Protected routes - Only accessible if "logged in" (demo auth) */}
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

     
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}