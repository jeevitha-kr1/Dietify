import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AboutUs from "../AboutUs";

// mocking useNavigate so we can track where it tries to go
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// mocking CookieBar since its a separate component, not what we're testing here
vi.mock("../../components/common/CookieBar", () => ({
  default: () => <div data-testid="cookie-bar" />,
}));

function renderAboutUs() {
  return render(
    <MemoryRouter>
      <AboutUs />
    </MemoryRouter>
  );
}

test("main heading renders correctly", () => {
  renderAboutUs();
  expect(
    screen.getByText(/personalized nutrition with a cleaner, smarter experience/i)
  ).toBeInTheDocument();
});

test("why dietify badge is visible", () => {
  renderAboutUs();
  expect(screen.getByText(/why dietify/i)).toBeInTheDocument();
});

test("start now button is visible", () => {
  renderAboutUs();
  expect(screen.getByRole("button", { name: /start now/i })).toBeInTheDocument();
});

test("back home button is visible", () => {
  renderAboutUs();
  expect(screen.getByRole("button", { name: /back home/i })).toBeInTheDocument();
});

test("clicking start now navigates to registration", () => {
  renderAboutUs();
  fireEvent.click(screen.getByRole("button", { name: /start now/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/registration");
});

test("clicking back home navigates to home", () => {
  renderAboutUs();
  fireEvent.click(screen.getByRole("button", { name: /back home/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});

test("smarter personalization card renders", () => {
  renderAboutUs();
  expect(screen.getByText(/smarter personalization/i)).toBeInTheDocument();
});

test("weekly planning flow card renders", () => {
  renderAboutUs();
  expect(screen.getByText(/weekly planning flow/i)).toBeInTheDocument();
});

test("shopping-ready output card renders", () => {
  renderAboutUs();
  expect(screen.getByText(/shopping-ready output/i)).toBeInTheDocument();
});

test("designed for simplicity kicker text shows", () => {
  renderAboutUs();
  expect(screen.getByText(/designed for simplicity/i)).toBeInTheDocument();
});

test("footer copyright text is visible", () => {
  renderAboutUs();
  expect(screen.getByText(/dietify © 2026/i)).toBeInTheDocument();
});

test("privacy and terms link renders", () => {
  renderAboutUs();
  expect(screen.getByRole("link", { name: /privacy & terms/i })).toBeInTheDocument();
});

test("privacy and terms link points to legal page", () => {
  renderAboutUs();
  const link = screen.getByRole("link", { name: /privacy & terms/i });
  expect(link).toHaveAttribute("href", "/legal");
});