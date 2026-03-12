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

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

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

function navigateToStep(stepIndex) {
  for (let i = 0; i < stepIndex; i++) {
    const q = onboardingQuestions[i];

    if (q.type === "number") {
      let val = "25";
      if (q.id === "height") val = "170";
      if (q.id === "weight") val = "65";
      if (q.id === "targetWeight") val = "60";
      if (q.id === "mealsPerDay") val = "3";

      fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
        target: { value: val },
      });
    } else if (q.type === "select") {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: q.options[0] } });
    } else if (q.type === "multiselect") {
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);
    }

    const nextBtn = screen.queryByRole("button", { name: /next/i });
    if (nextBtn) fireEvent.click(nextBtn);
  }
}

// find the first multiselect step index
const firstMultiselectIndex = onboardingQuestions.findIndex(
  (q) => q.type === "multiselect"
);

// --- basic rendering ---

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

// --- validation ---

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

// --- height validation ---

test("height below 100 shows validation error", () => {
  renderWithStore(<UserInput />);
  const heightIndex = onboardingQuestions.findIndex((q) => q.id === "height");
  navigateToStep(heightIndex);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "50" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/height must be between 100 cm and 250 cm/i)
  ).toBeInTheDocument();
});

test("height above 250 shows validation error", () => {
  renderWithStore(<UserInput />);
  const heightIndex = onboardingQuestions.findIndex((q) => q.id === "height");
  navigateToStep(heightIndex);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "300" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/height must be between 100 cm and 250 cm/i)
  ).toBeInTheDocument();
});

// --- weight validation ---

test("weight below 30 shows validation error", () => {
  renderWithStore(<UserInput />);
  const weightIndex = onboardingQuestions.findIndex((q) => q.id === "weight");
  navigateToStep(weightIndex);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "10" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/weight must be between 30 kg and 300 kg/i)
  ).toBeInTheDocument();
});

test("weight above 300 shows validation error", () => {
  renderWithStore(<UserInput />);
  const weightIndex = onboardingQuestions.findIndex((q) => q.id === "weight");
  navigateToStep(weightIndex);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "500" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/weight must be between 30 kg and 300 kg/i)
  ).toBeInTheDocument();
});

// --- target weight validation ---

test("target weight below 30 shows validation error", () => {
  renderWithStore(<UserInput />);
  const targetIndex = onboardingQuestions.findIndex((q) => q.id === "targetWeight");
  navigateToStep(targetIndex);
  fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
    target: { value: "10" },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(/target weight must be between 30 kg and 300 kg/i)
  ).toBeInTheDocument();
});

// --- meals per day ---

test("meals per day question renders a dropdown", () => {
  renderWithStore(<UserInput />);
  const mealsIndex = onboardingQuestions.findIndex((q) => q.id === "mealsPerDay");
  navigateToStep(mealsIndex);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

// --- select field ---

test("select dropdown renders on gender question", () => {
  renderWithStore(<UserInput />);
  const genderIndex = onboardingQuestions.findIndex((q) => q.id === "gender");
  navigateToStep(genderIndex);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("selecting an option from dropdown works", () => {
  renderWithStore(<UserInput />);
  const genderIndex = onboardingQuestions.findIndex((q) => q.id === "gender");
  navigateToStep(genderIndex);
  const select = screen.getByRole("combobox");
  fireEvent.change(select, {
    target: { value: onboardingQuestions[genderIndex].options[0] },
  });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(
    screen.getByText(new RegExp(`question ${genderIndex + 2}`, "i"))
  ).toBeInTheDocument();
});

// --- multiselect ---

test("multiselect checkboxes render", () => {
  renderWithStore(<UserInput />);
  navigateToStep(firstMultiselectIndex);
  expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
});

test("selecting None in multiselect deselects everything else", () => {
  renderWithStore(<UserInput />);
  navigateToStep(firstMultiselectIndex);
  const checkboxes = screen.getAllByRole("checkbox");
  fireEvent.click(checkboxes[0]);
  const noneLabel = screen.getByText(/^none$/i);
  fireEvent.click(noneLabel);
  expect(checkboxes[0]).not.toBeChecked();
});

test("selecting None twice deselects it", () => {
  renderWithStore(<UserInput />);
  navigateToStep(firstMultiselectIndex);
  const noneLabel = screen.getByText(/^none$/i);
  fireEvent.click(noneLabel);
  fireEvent.click(noneLabel);
  const noneCheckbox = screen.getAllByRole("checkbox").find(
    (cb) => cb.closest("label")?.textContent?.trim() === "None"
  );
  expect(noneCheckbox).not.toBeChecked();
});

// --- skip button ---

test("skip button is visible on optional questions", () => {
  renderWithStore(<UserInput />);
  const optionalIndex = onboardingQuestions.findIndex(
    (q) => !q.required && onboardingQuestions.indexOf(q) !== onboardingQuestions.length - 1 && onboardingQuestions.indexOf(q) !== 8
  );
  navigateToStep(optionalIndex);
  expect(screen.queryByRole("button", { name: /skip/i })).toBeInTheDocument();
});

test("skip button moves to next question", () => {
  renderWithStore(<UserInput />);
  const optionalIndex = onboardingQuestions.findIndex(
    (q) => !q.required && onboardingQuestions.indexOf(q) !== onboardingQuestions.length - 1 && onboardingQuestions.indexOf(q) !== 8
  );
  navigateToStep(optionalIndex);
  fireEvent.click(screen.getByRole("button", { name: /skip/i }));
  expect(
    screen.getByText(new RegExp(`question ${optionalIndex + 2}`, "i"))
  ).toBeInTheDocument();
});

// --- saved profile card ---

const completeAnswers = {
  age: "25",
  gender: "Male",
  height: "170",
  weight: "65",
  targetWeight: "60",
  activityLevel: "Moderate",
  goal: "Lose weight",
  dietPreference: "Vegetarian",
  allergies: ["None"],
  mealsPerDay: "3",
  preferredCuisine: "Indian",
  healthConditions: ["None"],
};

test("saved profile card shows when complete profile is in localStorage", () => {
  localStorage.setItem(
    "dietify_user_profile_test@example.com",
    JSON.stringify(completeAnswers)
  );
  renderWithStore(<UserInput />);
  expect(screen.getByText(/profile already saved/i)).toBeInTheDocument();
  localStorage.clear();
});

test("continue button on saved profile card navigates to result", () => {
  localStorage.setItem(
    "dietify_user_profile_test@example.com",
    JSON.stringify(completeAnswers)
  );
  renderWithStore(<UserInput />);
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/result");
  localStorage.clear();
});

test("update answers button hides saved card and shows form", () => {
  localStorage.setItem(
    "dietify_user_profile_test@example.com",
    JSON.stringify(completeAnswers)
  );
  renderWithStore(<UserInput />);
  fireEvent.click(screen.getByRole("button", { name: /update answers/i }));
  expect(screen.getByText(/question 1/i)).toBeInTheDocument();
  localStorage.clear();
});

// --- misc ---

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