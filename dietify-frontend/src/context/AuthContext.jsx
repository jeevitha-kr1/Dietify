import { createContext, useEffect, useMemo, useState } from "react";
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check if user session exists in localStorage 
    const localUser = localStorage.getItem("dietify_current_user");
    const sessionUser = sessionStorage.getItem("dietify_current_user");

    // Prefer localStorage if remember me was used
    const savedUser = localUser || sessionUser;

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user session:", error);
        localStorage.removeItem("dietify_current_user");
        sessionStorage.removeItem("dietify_current_user");
      }
    }

    // Mark auth as ready after initial session check
    setIsAuthReady(true);
  }, []);

  const login = (userData, rememberMe = false) => {
    // Save user session based on remember me choice
    if (rememberMe) {
      localStorage.setItem("dietify_current_user", JSON.stringify(userData));
      sessionStorage.removeItem("dietify_current_user");
    } else {
      sessionStorage.setItem("dietify_current_user", JSON.stringify(userData));
      localStorage.removeItem("dietify_current_user");
    }

    setCurrentUser(userData);
  };

  const logout = () => {
    // Clear all stored sessions
    localStorage.removeItem("dietify_current_user");
    sessionStorage.removeItem("dietify_current_user");

    setCurrentUser(null);
  };

  const deleteProfile = () => {
    // Remove registered demo account and active session
    localStorage.removeItem("dietify_registered_user");
    localStorage.removeItem("dietify_current_user");
    sessionStorage.removeItem("dietify_current_user");

    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      isAuthReady,
      login,
      logout,
      deleteProfile,
    }),
    [currentUser, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}