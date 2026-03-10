import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { describe, it, expect, vi } from "vitest";

import Registration from "../Registration";

// mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    deleteProfile: vi.fn(),
    currentUser: null,
    isAuthenticated: false
  })
}));

// simple redux store for testing
const reducer = (state = {}) => state;
const store = createStore(reducer);

function renderPage() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    </Provider>
  );
}

describe("Registration Page", () => {

  it("renders the registration heading", () => {
    renderPage();
    expect(screen.getByText(/Create your Dietify profile/i)).toBeInTheDocument();
  });

  it("shows register and login toggle buttons", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows full name field in register mode", () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
  });

  it("shows email input field", () => {
    renderPage();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  it("shows password input field", () => {
    renderPage();
    expect(screen.getAllByPlaceholderText(/password/i)[0]).toBeInTheDocument();
  });

  it("shows Back to Home button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /Back to Home/i })).toBeInTheDocument();
  });

});