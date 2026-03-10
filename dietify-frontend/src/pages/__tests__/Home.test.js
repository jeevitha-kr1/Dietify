import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";

describe("Home Page Component", () => {

  test("renders the main title", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const title = screen.getByText(/Eat better with a plan that feels personal/i);
    expect(title).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const description = screen.getByText(/Dietify helps you generate a weekly meal plan/i);
    expect(description).toBeInTheDocument();
  });

  test("renders Get Started button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const startButton = screen.getByRole("button", { name: /get started/i });
    expect(startButton).toBeInTheDocument();
  });

  test("renders Why Dietify button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const whyButton = screen.getByRole("button", { name: /why dietify/i });
    expect(whyButton).toBeInTheDocument();
  });

  test("renders hero feature cards", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Personalized weekly meals/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear nutrition insights/i)).toBeInTheDocument();
    expect(screen.getByText(/Shopping-ready results/i)).toBeInTheDocument();
  });

  test("renders footer with copyright", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const footer = screen.getByText(/Dietify © 2026/i);
    expect(footer).toBeInTheDocument();
  });

  test("Get Started button is clickable", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /get started/i });

    await userEvent.click(button);

    expect(button).toBeInTheDocument();
  });

});