import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

// Create the React root and render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux wrapper: gives access to global state */}
    <Provider store={store}>
      {/* Auth wrapper: manages login/session state */}
      <AuthProvider>
        {/* Router wrapper: enables page routing */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);