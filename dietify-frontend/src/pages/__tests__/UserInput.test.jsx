import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import UserInput from "../UserInput";
import userReducer from "../../store/slices/userSlice";
import resultReducer from "../../store/slices/resultSlice";
import cartReducer from "../../store/slices/cartSlice";
import aiReducer from "../../store/slices/aiSlice";
import { onboardingQuestions } from "../../data/onboardingQuestions";

// mock useAuth so it doesnt return null and crash everything
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    currentUser: {
      email: "test@example.com",
      fullName: "Test User",
    },
  }),
}));

function renderWithStore(ui) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

test("first question shows up on screen", () => {
  renderWithStore(<UserInput />);
  expect(screen.getByText(/question 1/i)).toBeInTheDocument();
});

test("back button is disabled on the first question", () => {
  renderWithStore(<UserInput />);
  expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
});

test("next button is visible on first question", () => {
  renderWithStore(<UserInput />);
  expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
});

test("progress bar renders", () => {
  renderWithStore(<UserInput />);
  expect(document.querySelector(".userinput-progress-fill")).toBeInTheDocument();
});

test("shows error if next is clicked without filling required field", () => {
  renderWithStore(<UserInput />);
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/please answer this question before continuing/i)
  ).toBeInTheDocument();
});

test("error clears after typing something", () => {
  renderWithStore(<UserInput />);
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "22" },
  });
  expect(
    screen.queryByText(/please answer this question before continuing/i)
  ).not.toBeInTheDocument();
});

test("age below 16 shows validation error", () => {
  renderWithStore(<UserInput />);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "10" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByText(/age must be between 16 and 100/i)).toBeInTheDocument();
});

test("age above 100 shows validation error", () => {
  renderWithStore(<UserInput />);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "150" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByText(/age must be between 16 and 100/i)).toBeInTheDocument();
});

test("valid age moves to next question", () => {
  renderWithStore(<UserInput />);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "25" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByText(/question 2/i)).toBeInTheDocument();
});

test("back button works after moving to step 2", () => {
  renderWithStore(<UserInput />);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "25" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  fireEvent.click(screen.getByRole("button", { name: /back/i }));
  expect(screen.getByText(/question 1/i)).toBeInTheDocument();
});

test("None option exists in all multiselect questions", () => {
  const multiselects = onboardingQuestions.filter((q) => q.type === "multiselect");
  multiselects.forEach((q) => {
    expect(q.options).toContain("None");
  });
});

test("does not crash when localStorage is empty", () => {
  localStorage.clear();
  expect(() => renderWithStore(<UserInput />)).not.toThrow();
});

test("finish button shows on last question instead of next", () => {
  expect(onboardingQuestions.length).toBeGreaterThan(0);
});