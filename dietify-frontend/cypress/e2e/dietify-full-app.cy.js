/// <reference types="cypress" />

/*
  Dietify full application Cypress suite
  --------------------------------------
  This file contains detailed scenario-based tests for the whole app.

  Covered areas:
  1. Logo page and auto redirect
  2. Home page and cookie bar
  3. About page
  4. Legal page
  5. Protected routes
  6. Registration validations
  7. Registration + login flow
  8. User input onboarding flow
  9. Result page
  10. Cart page
  11. Unknown route
*/

const WAIT_MS = 1500;

// Reusable delay helper
function pause(ms = WAIT_MS) {
  cy.wait(ms);
}

// Safely clear browser state before each test
function clearBrowserState() {
  cy.clearLocalStorage();
  cy.clearCookies();

  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
}

// Reusable registration helper
function registerUser(email = "jeevitha.test@example.com") {
  cy.visit("/registration");
  pause();

  cy.get("#fullName").type("Jeevitha R");
  pause();

  cy.get("#email").type(email);
  pause();

  cy.get("#password").type("Password123!");
  pause();

  cy.get("#confirmPassword").type("Password123!");
  pause();

  cy.contains("Create Account").click();
  pause();
}

// Reusable login helper
function loginUser(email = "jeevitha.test@example.com") {
  cy.visit("/registration");
  pause();

  cy.contains("Login").click();
  pause();

  cy.get("#email").type(email);
  pause();

  cy.get("#password").type("Password123!");
  pause();

  cy.contains("Login").click();
  pause();
}

// Register + login helper
function registerAndLogin(email = "jeevitha.test@example.com") {
  registerUser(email);

  cy.contains("Registration successful").should("be.visible");
  pause();

  cy.contains("Login").click();
  pause();

  cy.get("#email").clear().type(email);
  pause();

  cy.get("#password").clear().type("Password123!");
  pause();

  cy.contains("Login").click();
  pause();

  cy.url().should("include", "/user-input");
  pause();
}

// Complete onboarding questionnaire helper
function completeUserInputFlow() {
  // Q1 Age
  cy.get('input[type="number"]').clear().type("24");
  pause();
  cy.contains("Next").click();
  pause();

  // Q2 Gender
  cy.get("select").select("Female");
  pause();
  cy.contains("Next").click();
  pause();

  // Q3 Height
  cy.get('input[type="number"]').clear().type("165");
  pause();
  cy.contains("Next").click();
  pause();

  // Q4 Weight
  cy.get('input[type="number"]').clear().type("70");
  pause();
  cy.contains("Next").click();
  pause();

  // Q5 Target Weight
  cy.get('input[type="number"]').clear().type("60");
  pause();
  cy.contains("Next").click();
  pause();

  // Q6 Activity level
  cy.get("select").select("Moderately Active");
  pause();
  cy.contains("Next").click();
  pause();

  // Q7 Goal
  cy.get("select").select("Fat Loss");
  pause();
  cy.contains("Next").click();
  pause();

  // Q8 Diet preference
  cy.get("select").select("Vegetarian");
  pause();
  cy.contains("Next").click();
  pause();

  // Q9 Allergies
  cy.contains("None").click();
  pause();
  cy.contains("Next").click();
  pause();

  // Q10 Meals per day
  cy.get("select").select("3");
  pause();
  cy.contains("Next").click();
  pause();

  // Q11 Preferred cuisine
  cy.get("select").select("Indian");
  pause();
  cy.contains("Next").click();
  pause();

  // Q12 Health conditions
  cy.contains("None").click();
  pause();
  cy.contains("Finish").click();
  pause();
}

describe("Dietify - Full application scenarios in one file", () => {
  beforeEach(() => {
    clearBrowserState();
  });

  // =========================================================
  // 1. LOGO PAGE SCENARIOS
  // =========================================================

  it("shows logo page first and then redirects to home after about 2 seconds", () => {
    cy.visit("/");
    pause();

    cy.contains("Dietify").should("be.visible");
    cy.contains("Personalized nutrition made simple").should("be.visible");
    pause(2500);

    cy.url().should("include", "/home");
    pause();
  });

  // =========================================================
  // 2. HOME PAGE SCENARIOS
  // =========================================================

  it("shows the home page hero content correctly", () => {
    cy.visit("/home");
    pause();

    cy.contains("AI-powered wellness").should("be.visible");
    cy.contains("Eat better with a plan that feels personal.").should("be.visible");
    cy.contains("Get Started").should("be.visible");
    cy.contains("Why Dietify").should("be.visible");
    cy.contains("Privacy & Terms").should("be.visible");
    pause();
  });

  it("shows cookie bar on home page and accepts cookies", () => {
    cy.visit("/home");
    pause();

    cy.contains("Cookie preferences").should("be.visible");
    cy.contains("Essential Only").should("be.visible");
    cy.contains("Reject").should("be.visible");
    cy.contains("Accept All").should("be.visible");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("dietify_cookie_consent")).to.equal("accepted");
    });
    pause();
  });

  it("shows cookie bar on home page and rejects cookies", () => {
    cy.visit("/home");
    pause();

    cy.contains("Reject").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("dietify_cookie_consent")).to.equal("rejected");
    });
    pause();
  });

  it("shows cookie bar on home page and saves essential only choice", () => {
    cy.visit("/home");
    pause();

    cy.contains("Essential Only").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("dietify_cookie_consent")).to.equal("essential_only");
    });
    pause();
  });

  it("navigates from home to registration using Get Started", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Get Started").click();
    pause();

    cy.url().should("include", "/registration");
    cy.contains("Create your Dietify profile").should("be.visible");
    pause();
  });

  it("navigates from home to about using Why Dietify", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Why Dietify").click();
    pause();

    cy.url().should("include", "/about");
    cy.contains("Personalized nutrition with a cleaner, smarter experience.").should("be.visible");
    pause();
  });

  it("navigates from home to legal page using Privacy & Terms", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Privacy & Terms").click();
    pause();

    cy.url().should("include", "/legal");
    cy.contains("Privacy Policy & Terms").should("be.visible");
    pause();
  });

  // =========================================================
  // 3. ABOUT PAGE SCENARIOS
  // =========================================================

  it("shows about page correctly and allows cookie selection", () => {
    cy.visit("/about");
    pause();

    cy.contains("Why Dietify").should("be.visible");
    cy.contains("Start Now").should("be.visible");
    cy.contains("Back Home").should("be.visible");
    cy.contains("Privacy & Terms").should("be.visible");
    cy.contains("Cookie preferences").should("be.visible");
    pause();

    cy.contains("Essential Only").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
    pause();
  });

  it("navigates from about page to registration using Start Now", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Start Now").click();
    pause();

    cy.url().should("include", "/registration");
    pause();
  });

  it("navigates from about page back home using Back Home", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Back Home").click();
    pause();

    cy.url().should("include", "/home");
    pause();
  });

  it("navigates from about page to legal page using Privacy & Terms", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Privacy & Terms").click();
    pause();

    cy.url().should("include", "/legal");
    pause();
  });

  // =========================================================
  // 4. LEGAL PAGE SCENARIOS
  // =========================================================

  it("shows legal page with privacy, terms, and contact sections", () => {
    cy.visit("/legal");
    pause();

    cy.contains("Privacy Policy & Terms").should("be.visible");
    cy.contains("Privacy Policy").should("be.visible");
    cy.contains("Terms & Conditions").should("be.visible");
    cy.contains("Contact").should("be.visible");
    pause();
  });

  // =========================================================
  // 5. PROTECTED ROUTE SCENARIOS
  // =========================================================

  it("redirects unauthenticated user from /user-input to /registration", () => {
    cy.visit("/user-input");
    pause(2000);

    cy.url().should("include", "/registration");
    pause();
  });

  it("redirects unauthenticated user from /result to /registration", () => {
    cy.visit("/result");
    pause(2000);

    cy.url().should("include", "/registration");
    pause();
  });

  it("redirects unauthenticated user from /cart to /registration", () => {
    cy.visit("/cart");
    pause(2000);

    cy.url().should("include", "/registration");
    pause();
  });

  // =========================================================
  // 6. REGISTRATION VALIDATION SCENARIOS
  // =========================================================

  it("shows error when register form is submitted empty", () => {
    cy.visit("/registration");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Please correct the highlighted fields.").should("be.visible");
    pause();
  });

  it("shows error when full name contains only numbers", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("123456");
    pause();

    cy.get("#email").type("numbers@test.com");
    pause();

    cy.get("#password").type("Password123!");
    pause();

    cy.get("#confirmPassword").type("Password123!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Name can only contain letters and basic punctuation.").should("be.visible");
    pause();
  });

  it("shows error when email format is invalid", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("invalid-email");
    pause();

    cy.get("#password").type("Password123!");
    pause();

    cy.get("#confirmPassword").type("Password123!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Please enter a valid email address.").should("be.visible");
    pause();
  });

  it("shows error when password is too short", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("shortpass@test.com");
    pause();

    cy.get("#password").type("Ab1!");
    pause();

    cy.get("#confirmPassword").type("Ab1!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Password must be at least 8 characters.").should("be.visible");
    pause();
  });

  it("shows error when password has no uppercase letter", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("noupper@test.com");
    pause();

    cy.get("#password").type("password123!");
    pause();

    cy.get("#confirmPassword").type("password123!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Include at least one uppercase letter.").should("be.visible");
    pause();
  });

  it("shows error when password has no lowercase letter", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("nolower@test.com");
    pause();

    cy.get("#password").type("PASSWORD123!");
    pause();

    cy.get("#confirmPassword").type("PASSWORD123!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Include at least one lowercase letter.").should("be.visible");
    pause();
  });

  it("shows error when password has no number", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("nonumber@test.com");
    pause();

    cy.get("#password").type("Password!!!");
    pause();

    cy.get("#confirmPassword").type("Password!!!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Include at least one number.").should("be.visible");
    pause();
  });

  it("shows error when password has no special character", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("nospecial@test.com");
    pause();

    cy.get("#password").type("Password123");
    pause();

    cy.get("#confirmPassword").type("Password123");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Include at least one special character.").should("be.visible");
    pause();
  });

  it("shows error when confirm password does not match", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("nomatch@test.com");
    pause();

    cy.get("#password").type("Password123!");
    pause();

    cy.get("#confirmPassword").type("Password999!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("Passwords do not match.").should("be.visible");
    pause();
  });

  it("toggles password visibility correctly", () => {
    cy.visit("/registration");
    pause();

    cy.get("#password").should("have.attr", "type", "password");
    pause();

    cy.get('button[aria-label="Show password"]').click();
    pause();

    cy.get("#password").should("have.attr", "type", "text");
    pause();

    cy.get('button[aria-label="Hide password"]').click();
    pause();

    cy.get("#password").should("have.attr", "type", "password");
    pause();
  });

  // =========================================================
  // 7. REGISTRATION + LOGIN SCENARIOS
  // =========================================================

  it("registers a new user successfully", () => {
    registerUser("register.success@test.com");

    cy.contains("Registration successful").should("be.visible");
    pause();
  });

  it("prevents duplicate email registration", () => {
    registerUser("duplicate@test.com");
    cy.contains("Registration successful").should("be.visible");
    pause();

    cy.contains("Register").click();
    pause();

    cy.get("#fullName").type("Jeevitha R");
    pause();

    cy.get("#email").type("duplicate@test.com");
    pause();

    cy.get("#password").type("Password123!");
    pause();

    cy.get("#confirmPassword").type("Password123!");
    pause();

    cy.contains("Create Account").click();
    pause();

    cy.contains("An account with this email already exists. Please log in instead.").should(
      "be.visible"
    );
    pause();
  });

  it("logs in successfully with valid credentials", () => {
    registerAndLogin("login.success@test.com");

    cy.url().should("include", "/user-input");
    pause();
  });

  it("shows error for invalid login credentials", () => {
    registerUser("invalid.login@test.com");
    pause();

    cy.contains("Login").click();
    pause();

    cy.get("#email").clear().type("invalid.login@test.com");
    pause();

    cy.get("#password").clear().type("WrongPassword123!");
    pause();

    cy.contains("Login").click();
    pause();

    cy.contains("Invalid email or password.").should("be.visible");
    pause();
  });

  // =========================================================
  // 8. USER INPUT QUESTIONNAIRE SCENARIOS
  // =========================================================

  it("shows first onboarding question after login", () => {
    registerAndLogin("question.start@test.com");

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
    pause();
  });

  it("shows validation error when required question is skipped", () => {
    registerAndLogin("question.required@test.com");

    cy.contains("Next").click();
    pause();

    cy.contains("Please answer this question before continuing.").should("be.visible");
    pause();
  });

  it("shows age range validation error when age is below 16", () => {
    registerAndLogin("age.validation@test.com");

    cy.get('input[type="number"]').type("10");
    pause();

    cy.contains("Next").click();
    pause();

    cy.contains("Age must be between 16 and 100.").should("be.visible");
    pause();
  });

  it("completes the full onboarding flow and reaches result page", () => {
    registerAndLogin("full.flow@test.com");

    completeUserInputFlow();

    cy.url().should("include", "/result");
    pause();
  });

  // =========================================================
  // 9. RESULT PAGE SCENARIOS
  // =========================================================

  it("shows result metrics and weekly meal plan after completing questionnaire", () => {
    registerAndLogin("result.metrics@test.com");
    completeUserInputFlow();

    cy.contains("Your personalized nutrition plan").should("be.visible");
    pause();

    cy.contains("BMI").should("be.visible");
    cy.contains("Calories").should("be.visible");
    cy.contains("Protein").should("be.visible");
    cy.contains("Carbs").should("be.visible");
    cy.contains("Fats").should("be.visible");
    pause();

    cy.contains("AI Nutrition Summary").should("be.visible");
    cy.contains("Weekly Meal Plan").should("be.visible");
    pause();
  });

  it("shows either AI output or fallback meal plan safely", () => {
    registerAndLogin("result.fallback@test.com");
    completeUserInputFlow();

    cy.contains("AI Nutrition Summary").should("be.visible");
    pause(3000);

    cy.get("body").then(($body) => {
      const bodyText = $body.text();

      expect(
        bodyText.includes(
          "AI is temporarily unavailable. Showing a demo meal plan instead."
        ) ||
          bodyText.includes(
            "Here is your AI-generated 7-day meal plan based on your profile and goals."
          ) ||
          bodyText.includes(
            "Based on your profile, this weekly plan focuses on balanced nutrition, practical meals, and consistent eating habits."
          )
      ).to.equal(true);
    });
    pause();
  });

  it("allows switching day tabs on result page when available", () => {
    registerAndLogin("day.tabs@test.com");
    completeUserInputFlow();

    cy.contains("Weekly Meal Plan").should("be.visible");
    pause(3000);

    cy.get("body").then(($body) => {
      if ($body.find(".day-tab").length > 0) {
        cy.get(".day-tab").first().click();
        pause();
      }
    });
  });

  it("adds meal ingredients to cart from result page", () => {
    registerAndLogin("add.cart@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("ingredients added to cart").should("be.visible");
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    pause();
  });

  // =========================================================
  // 10. CART PAGE SCENARIOS
  // =========================================================

  it("shows empty cart state when no items are added", () => {
    registerAndLogin("empty.cart@test.com");

    cy.visit("/cart");
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    cy.contains("Add ingredients from your meal plan to build your shopping list.").should(
      "be.visible"
    );
    pause();
  });

  it("shows cart items after adding ingredients from result page", () => {
    registerAndLogin("cart.items@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Your Shopping Cart").should("be.visible");
    pause();

    cy.get("body").then(($body) => {
      expect($body.text()).not.to.contain("Your cart is empty");
    });
    pause();
  });

  it("allows increasing and decreasing quantity in cart", () => {
    registerAndLogin("cart.qty@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.get(".qty-btn").last().click();
    pause();

    cy.get(".qty-btn").first().click({ multiple: true });
    pause();
  });

  it("allows removing items from cart", () => {
    registerAndLogin("cart.remove@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Remove").first().click();
    pause();
  });

  it("shows export and clear cart actions when cart has items", () => {
    registerAndLogin("cart.export@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Download PDF").should("be.visible");
    cy.contains("Download Excel").should("be.visible");
    cy.contains("Clear Cart").should("be.visible");
    pause();
  });

  it("clears the cart successfully", () => {
    registerAndLogin("cart.clear@test.com");
    completeUserInputFlow();

    pause(3000);

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Clear Cart").click();
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    pause();
  });

  // =========================================================
  // 11. UNKNOWN ROUTE SCENARIO
  // =========================================================

  it("shows page not found for unknown routes", () => {
    cy.visit("/some-random-route", { failOnStatusCode: false });
    pause();

    cy.contains("Page Not Found").should("be.visible");
    pause();
  });
});