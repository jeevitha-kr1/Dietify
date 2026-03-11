// src/pages/__tests__/Result.test.jsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import Result from "../Result";
import aiReducer from "../../store/slices/aiSlice";
import cartReducer from "../../store/slices/cartSlice";
import userReducer from "../../store/slices/userSlice";
import resultReducer from "../../store/slices/resultSlice";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../services/aiDietService", () => ({
  generateAIMealPlan: vi.fn(() =>
    Promise.resolve({ days: [], tips: [], groceryList: [] })
  ),
}));

const mockProfile = {
  age: 22,
  height: 170,
  weight: 65,
  gender: "Male",
  activityLevel: "Moderate",
  goal: "Maintain",
};

const mockResults = {
  bmi: "22.5",
  bmiCategory: "Normal",
  calories: 2000,
  macros: {
    protein: 150,
    carbs: 250,
    fats: 65,
  },
};

const mockWeeklyPlan = [
  {
    day: "Monday",
    dailyCalories: 1520,
    meals: [
      {
        mealType: "Breakfast",
        title: "Oats with banana",
        calories: 350,
        ingredients: ["Oats", "Banana", "Milk"],
      },
      {
        mealType: "Lunch",
        title: "Rice with dal",
        calories: 550,
        ingredients: ["Rice", "Dal", "Onion"],
      },
    ],
  },
  {
    day: "Tuesday",
    dailyCalories: 1480,
    meals: [
      {
        mealType: "Breakfast",
        title: "Poha with peanuts",
        calories: 300,
        ingredients: ["Poha", "Peanuts", "Onion"],
      },
    ],
  },
];

function buildStore(aiOverride = {}) {
  return configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
    preloadedState: {
      user: { profile: mockProfile },
      result: mockResults,
      cart: { items: [] },
      ai: {
        loading: false,
        summary: "Your personalized plan is ready.",
        weeklyPlan: mockWeeklyPlan,
        tips: ["Drink more water.", "Eat protein with every meal."],
        groceryList: [],
        ...aiOverride,
      },
    },
  });
}

function renderResult(aiOverride = {}) {
  const store = buildStore(aiOverride);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Result />
      </MemoryRouter>
    </Provider>
  );
}

// --- basic rendering ---

test("page heading shows up", () => {
  renderResult();
  expect(screen.getByText(/your personalized nutrition plan/i)).toBeInTheDocument();
});

test("BMI value is displayed", () => {
  renderResult();
  expect(screen.getByText("22.5")).toBeInTheDocument();
});

test("BMI category shows correctly", () => {
  renderResult();
  expect(screen.getByText(/normal/i)).toBeInTheDocument();
});

test("calories per day is shown", () => {
  renderResult();
  expect(screen.getByText("2000")).toBeInTheDocument();
});

test("protein grams are displayed", () => {
  renderResult();
  expect(screen.getByText(/150/i)).toBeInTheDocument();
});

test("carbs are displayed", () => {
  renderResult();
  expect(screen.getByText(/250/i)).toBeInTheDocument();
});

test("fats are displayed", () => {
  renderResult();
  expect(screen.getByText(/65/i)).toBeInTheDocument();
});

// --- ai summary ---

test("AI summary text renders", () => {
  renderResult();
  expect(screen.getByText(/your personalized plan is ready/i)).toBeInTheDocument();
});

test("loading message shows when AI is still loading", () => {
  renderResult({ loading: true, weeklyPlan: [] });
  expect(screen.getByText(/generating your personalized plan/i)).toBeInTheDocument();
});

// --- day tabs ---

test("Monday tab is visible", () => {
  renderResult();
  expect(screen.getByRole("button", { name: /monday/i })).toBeInTheDocument();
});

test("Tuesday tab is visible", () => {
  renderResult();
  expect(screen.getByRole("button", { name: /tuesday/i })).toBeInTheDocument();
});

test("clicking Tuesday tab switches the day panel", () => {
  renderResult();
  fireEvent.click(screen.getByRole("button", { name: /tuesday/i }));
  expect(screen.getByText(/poha with peanuts/i)).toBeInTheDocument();
});

test("Monday meals show by default", () => {
  renderResult();
  expect(screen.getByText(/oats with banana/i)).toBeInTheDocument();
});

test("meal calories are shown on the card", () => {
  renderResult();
  expect(screen.getByText(/350/i)).toBeInTheDocument();
});

// --- ingredients ---

test("ingredients list renders inside meal card", () => {
  renderResult();
  const oatsItems = screen.getAllByText(/oats/i);
  expect(oatsItems.length).toBeGreaterThan(0);
});

test("add ingredients button is visible", () => {
  renderResult();
  const addButtons = screen.getAllByRole("button", { name: /add ingredients to cart/i });
  expect(addButtons.length).toBeGreaterThan(0);
});

test("clicking add ingredients shows cart toast", () => {
  renderResult();
  const addButtons = screen.getAllByRole("button", { name: /add ingredients to cart/i });
  fireEvent.click(addButtons[0]);
  expect(screen.getByText(/ingredients added to cart/i)).toBeInTheDocument();
});

// --- tips ---

test("helpful tips section renders", () => {
  renderResult();
  expect(screen.getByText(/helpful tips/i)).toBeInTheDocument();
});

test("tip content shows up", () => {
  renderResult();
  expect(screen.getByText(/drink more water/i)).toBeInTheDocument();
});

test("shows fallback message when no tips available", () => {
  renderResult({ tips: [] });
  expect(screen.getByText(/no additional tips available yet/i)).toBeInTheDocument();
});

// --- cart ---

test("view cart button is visible", () => {
  renderResult();
  expect(screen.getByRole("button", { name: /view cart/i })).toBeInTheDocument();
});

test("cart count starts at 0", () => {
  renderResult();
  expect(screen.getByText(/view cart \(0\)/i)).toBeInTheDocument();
});

// --- empty state ---

test("shows no meal plan message when weeklyPlan is empty", () => {
  renderResult({ weeklyPlan: [] });
  expect(screen.getByText(/no weekly meal plan available yet/i)).toBeInTheDocument();
});

// --- redirect ---

test("redirects to user-input if profile is missing", () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
    preloadedState: {
      user: { profile: {} },
      result: mockResults,
      cart: { items: [] },
      ai: { loading: false, summary: "", weeklyPlan: [], tips: [], groceryList: [] },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Result />
      </MemoryRouter>
    </Provider>
  );

  expect(mockNavigate).toHaveBeenCalledWith("/user-input");
});

// --- AI failure fallback ---

test("shows fallback data when AI call fails", async () => {
  const { generateAIMealPlan } = await import("../../services/aiDietService");
  generateAIMealPlan.mockRejectedValueOnce(new Error("API failed"));

  const store = configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
    preloadedState: {
      user: { profile: mockProfile },
      result: mockResults,
      cart: { items: [] },
      ai: { loading: false, summary: "", weeklyPlan: [], tips: [], groceryList: [] },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Result />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/ai is temporarily unavailable/i)
    ).toBeInTheDocument();
  });
});

// --- empty days from AI ---

test("shows no meal plan when AI returns empty days", async () => {
  const { generateAIMealPlan } = await import("../../services/aiDietService");
  generateAIMealPlan.mockResolvedValueOnce({ days: [], tips: [], groceryList: [] });

  const store = configureStore({
    reducer: {
      user: userReducer,
      result: resultReducer,
      cart: cartReducer,
      ai: aiReducer,
    },
    preloadedState: {
      user: { profile: mockProfile },
      result: mockResults,
      cart: { items: [] },
      ai: { loading: false, summary: "", weeklyPlan: [], tips: [], groceryList: [] },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Result />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/no weekly meal plan available yet/i)
    ).toBeInTheDocument();
  });
});

// --- empty ingredients ---

test("does not show add button when meal has no ingredients", () => {
  renderResult({
    weeklyPlan: [
      {
        day: "Monday",
        dailyCalories: 1500,
        meals: [
          {
            mealType: "Breakfast",
            title: "Empty meal",
            calories: 300,
            ingredients: [],
          },
        ],
      },
    ],
  });

  expect(
    screen.queryByRole("button", { name: /add ingredients to cart/i })
  ).not.toBeInTheDocument();
});

// --- empty meals for a day ---

test("shows no meals message when day has empty meals array", () => {
  renderResult({
    weeklyPlan: [
      {
        day: "Monday",
        dailyCalories: 1500,
        meals: [],
      },
    ],
  });

  expect(screen.getByText(/no meals available for this day/i)).toBeInTheDocument();
});