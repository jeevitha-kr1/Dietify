// src/pages/__tests__/Registration.test.jsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import Registration from "../Registration";
import userReducer from "../../store/slices/userSlice";
import resultReducer from "../../store/slices/resultSlice";
import cartReducer from "../../store/slices/cartSlice";
import aiReducer from "../../store/slices/aiSlice";

// mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// mock auth utils
vi.mock("../../utils/auth", () => ({
  createLocalUser: vi.fn(() => Promise.resolve()),
  validateLocalLogin: vi.fn(() =>
    Promise.resolve({ fullName: "Test User", email: "test@example.com" })
  ),
}));

// default mock for useAuth - not logged in
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockDeleteProfile = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: mockLogout,
    deleteProfile: mockDeleteProfile,
    currentUser: null,
    isAuthenticated: false,
  }),
}));

function buildStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
  });
}

function renderPage() {
  return render(
    <Provider store={buildStore()}>
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    </Provider>
  );
}

// helper to fill register form
function fillRegisterForm({
  name = "John Doe",
  email = "john@example.com",
  password = "Test@1234",
  confirm = "Test@1234",
} = {}) {
  fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
    target: { name: "fullName", value: name },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { name: "email", value: email },
  });

  // two password fields exist so grab all and pick the first one
  const passwordInputs = screen.getAllByPlaceholderText(/password/i);
  fireEvent.change(passwordInputs[0], {
    target: { name: "password", value: password },
  });
  fireEvent.change(passwordInputs[1], {
    target: { name: "confirmPassword", value: confirm },
  });
}

// --- rendering ---

test("register heading shows by default", () => {
  renderPage();
  expect(screen.getByText(/create your dietify profile/i)).toBeInTheDocument();
});

test("register and login toggle buttons are visible", () => {
  renderPage();
  expect(screen.getByRole("button", { name: /^register$/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
});

test("full name field shows in register mode", () => {
  renderPage();
  expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
});

test("email field is visible", () => {
  renderPage();
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
});

test("password field is visible", () => {
  renderPage();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
});

test("confirm password field is visible in register mode", () => {
  renderPage();
  expect(screen.getByPlaceholderText(/re-enter your password/i)).toBeInTheDocument();
});

test("remember me checkbox is visible", () => {
  renderPage();
  expect(screen.getByText(/remember me on this browser/i)).toBeInTheDocument();
});

test("back to home button is visible", () => {
  renderPage();
  expect(screen.getByRole("button", { name: /back to home/i })).toBeInTheDocument();
});

test("create account submit button is visible", () => {
  renderPage();
  expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
});

// --- mode toggle ---

test("switching to login hides full name and confirm password fields", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
  expect(screen.queryByPlaceholderText(/enter your full name/i)).not.toBeInTheDocument();
  expect(screen.queryByPlaceholderText(/re-enter your password/i)).not.toBeInTheDocument();
});

test("login heading shows after switching to login", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
  expect(screen.getByText(/welcome back to dietify/i)).toBeInTheDocument();
});

test("switching back to register shows full name field again", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
  fireEvent.click(screen.getByRole("button", { name: /^register$/i }));
  expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
});

// --- password toggle ---

test("password is hidden by default", () => {
  renderPage();
  expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "password");
});

test("clicking show reveals the password", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /show password$/i }));
  expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "text");
});

test("clicking hide hides the password again", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /show password$/i }));
  fireEvent.click(screen.getByRole("button", { name: /hide password$/i }));
  expect(screen.getByLabelText(/^password$/i)).toHaveAttribute("type", "password");
});

// --- register validation ---

test("submitting empty register form shows error", async () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  await waitFor(() => {
    expect(screen.getByText(/please correct the highlighted fields/i)).toBeInTheDocument();
  });
});

test("short name shows field error", () => {
  renderPage();
  fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
    target: { name: "fullName", value: "A" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
});

test("invalid email shows field error", () => {
  renderPage();
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { name: "email", value: "notanemail" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
});

test("short password shows field error", () => {
  renderPage();
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { name: "password", value: "abc" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
});

test("mismatched passwords shows error", () => {
  renderPage();
  fillRegisterForm({ confirm: "Different@999" });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});

test("password without uppercase shows error", () => {
  renderPage();
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { name: "password", value: "lowercase@1" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/include at least one uppercase letter/i)).toBeInTheDocument();
});

test("password without special character shows error", () => {
  renderPage();
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { name: "password", value: "NoSpecial1" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  expect(screen.getByText(/include at least one special character/i)).toBeInTheDocument();
});

// --- successful register ---

test("valid registration shows success message and switches to login", async () => {
  localStorage.clear();
  renderPage();
  fillRegisterForm();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  await waitFor(() => {
    expect(
      screen.getByText(/registration successful/i)
    ).toBeInTheDocument();
  });
});

// --- login validation ---

test("submitting empty login form shows error", async () => {
  renderPage();
  // first click switches to login mode
  fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
  // now two login buttons exist - toggle and submit, pick the submit one
  const loginButtons = screen.getAllByRole("button", { name: /^login$/i });
  const submitButton = loginButtons[loginButtons.length - 1];
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(screen.getByText(/please correct the highlighted fields/i)).toBeInTheDocument();
  });
});

// --- back to home ---

test("clicking back to home navigates to home", () => {
  renderPage();
  fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});

// --- remember me ---

test("remember me checkbox can be checked", () => {
  renderPage();
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});

// --- benefits section ---

test("profile-first benefit card renders", () => {
  renderPage();
  expect(screen.getByText(/profile-first/i)).toBeInTheDocument();
});

test("weekly planning benefit card renders", () => {
  renderPage();
  expect(screen.getByText(/weekly planning/i)).toBeInTheDocument();
});

test("smart shopping benefit card renders", () => {
  renderPage();
  expect(screen.getByText(/smart shopping/i)).toBeInTheDocument();
});