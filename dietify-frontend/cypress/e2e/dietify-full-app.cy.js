const WAIT_MS = 1200;

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

// Mock AI response so Result and Cart tests are stable
function mockAiMealPlan() {
  const mockResponse = {
    summary:
      "This weekly plan supports fat loss with balanced vegetarian meals, steady energy, and practical grocery choices.",
    weeklyPlan: [
      {
        day: "Monday",
        dailyCalories: 1600,
        meals: [
          {
            mealType: "Breakfast",
            title: "Oats with banana and almonds",
            calories: 350,
            ingredients: ["Oats", "Banana", "Milk", "Almonds"],
          },
          {
            mealType: "Lunch",
            title: "Rice with dal and vegetables",
            calories: 550,
            ingredients: ["Rice", "Dal", "Carrot", "Beans", "Onion"],
          },
          {
            mealType: "Dinner",
            title: "Paneer salad bowl",
            calories: 420,
            ingredients: ["Paneer", "Cucumber", "Tomato", "Lettuce"],
          },
          {
            mealType: "Snack",
            title: "Apple with peanut butter",
            calories: 200,
            ingredients: ["Apple", "Peanut Butter"],
          },
        ],
      },
      {
        day: "Tuesday",
        dailyCalories: 1580,
        meals: [
          {
            mealType: "Breakfast",
            title: "Greek yogurt bowl",
            calories: 320,
            ingredients: ["Greek Yogurt", "Berries", "Chia Seeds"],
          },
          {
            mealType: "Lunch",
            title: "Vegetable quinoa bowl",
            calories: 540,
            ingredients: ["Quinoa", "Broccoli", "Capsicum", "Corn"],
          },
          {
            mealType: "Dinner",
            title: "Tofu stir fry",
            calories: 430,
            ingredients: ["Tofu", "Bell Pepper", "Soy Sauce", "Onion"],
          },
          {
            mealType: "Snack",
            title: "Mixed nuts",
            calories: 180,
            ingredients: ["Almonds", "Walnuts", "Cashews"],
          },
        ],
      },
      {
        day: "Wednesday",
        dailyCalories: 1620,
        meals: [
          {
            mealType: "Breakfast",
            title: "Smoothie bowl",
            calories: 340,
            ingredients: ["Banana", "Spinach", "Milk", "Oats"],
          },
          {
            mealType: "Lunch",
            title: "Chickpea salad",
            calories: 500,
            ingredients: ["Chickpeas", "Tomato", "Cucumber", "Lemon"],
          },
          {
            mealType: "Dinner",
            title: "Vegetable wrap",
            calories: 450,
            ingredients: ["Tortilla", "Paneer", "Lettuce", "Tomato"],
          },
          {
            mealType: "Snack",
            title: "Fruit mix",
            calories: 190,
            ingredients: ["Apple", "Orange", "Grapes"],
          },
        ],
      },
      {
        day: "Thursday",
        dailyCalories: 1590,
        meals: [
          {
            mealType: "Breakfast",
            title: "Avocado toast",
            calories: 330,
            ingredients: ["Bread", "Avocado", "Pepper Flakes"],
          },
          {
            mealType: "Lunch",
            title: "Brown rice bowl",
            calories: 560,
            ingredients: ["Brown Rice", "Beans", "Carrot", "Peas"],
          },
          {
            mealType: "Dinner",
            title: "Lentil soup",
            calories: 410,
            ingredients: ["Lentils", "Onion", "Garlic", "Tomato"],
          },
          {
            mealType: "Snack",
            title: "Roasted seeds",
            calories: 170,
            ingredients: ["Pumpkin Seeds", "Sunflower Seeds"],
          },
        ],
      },
      {
        day: "Friday",
        dailyCalories: 1610,
        meals: [
          {
            mealType: "Breakfast",
            title: "Peanut butter oats",
            calories: 360,
            ingredients: ["Oats", "Peanut Butter", "Milk"],
          },
          {
            mealType: "Lunch",
            title: "Veg pulao",
            calories: 540,
            ingredients: ["Rice", "Beans", "Carrot", "Peas"],
          },
          {
            mealType: "Dinner",
            title: "Grilled paneer plate",
            calories: 430,
            ingredients: ["Paneer", "Capsicum", "Onion", "Cucumber"],
          },
          {
            mealType: "Snack",
            title: "Banana",
            calories: 120,
            ingredients: ["Banana"],
          },
        ],
      },
      {
        day: "Saturday",
        dailyCalories: 1570,
        meals: [
          {
            mealType: "Breakfast",
            title: "Idli and chutney",
            calories: 300,
            ingredients: ["Idli Batter", "Coconut", "Green Chili"],
          },
          {
            mealType: "Lunch",
            title: "Dal khichdi",
            calories: 560,
            ingredients: ["Rice", "Dal", "Turmeric", "Onion"],
          },
          {
            mealType: "Dinner",
            title: "Vegetable soup and toast",
            calories: 400,
            ingredients: ["Carrot", "Beans", "Bread", "Pepper"],
          },
          {
            mealType: "Snack",
            title: "Curd cup",
            calories: 160,
            ingredients: ["Curd"],
          },
        ],
      },
      {
        day: "Sunday",
        dailyCalories: 1630,
        meals: [
          {
            mealType: "Breakfast",
            title: "Poha bowl",
            calories: 320,
            ingredients: ["Poha", "Peanuts", "Onion", "Curry Leaves"],
          },
          {
            mealType: "Lunch",
            title: "Paneer rice bowl",
            calories: 580,
            ingredients: ["Rice", "Paneer", "Tomato", "Onion"],
          },
          {
            mealType: "Dinner",
            title: "Salad plate",
            calories: 390,
            ingredients: ["Lettuce", "Tomato", "Cucumber", "Olives"],
          },
          {
            mealType: "Snack",
            title: "Dates and nuts",
            calories: 180,
            ingredients: ["Dates", "Almonds"],
          },
        ],
      },
    ],
    tips: [
      "Drink water consistently through the day.",
      "Keep meal timings regular.",
      "Include protein in every main meal.",
    ],
  };

  cy.intercept("POST", "**/models/gemini-2.5-flash:generateContent*", {
    statusCode: 200,
    body: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify(mockResponse),
              },
            ],
          },
        },
      ],
    },
  }).as("generateMealPlan");
}

// Reusable registration helper
function registerUser(email = "jeevitha.test@example.com") {
  cy.visit("/registration");
  pause();

  cy.get("#fullName").clear().type("Jeevitha R");
  cy.get("#email").clear().type(email);
  cy.get("#password").clear().type("Password123!");
  cy.get("#confirmPassword").clear().type("Password123!");

  cy.get("form.registration-form button[type='submit']")
    .contains("Create Account")
    .click();

  pause();
}

// Register + login helper
function registerAndLogin(email = "jeevitha.test@example.com") {
  registerUser(email);

  cy.contains("Registration successful").should("be.visible");
  pause();

  cy.get("#email").clear().type(email);
  cy.get("#password").clear().type("Password123!");

  cy.get("form.registration-form button[type='submit']")
    .contains("Login")
    .click();

  pause();
  cy.url().should("include", "/user-input");
}

// Helper that works for input, select, and click-option flows
function answerQuestion(value) {
  cy.get("body").then(($body) => {
    if ($body.find('input[type="number"]').length > 0) {
      cy.get('input[type="number"]').clear().type(String(value));
    } else if ($body.find("select").length > 0) {
      cy.get("select").select(String(value));
    } else {
      cy.contains(String(value)).click({ force: true });
    }
  });

  pause();
}

// Complete onboarding questionnaire helper
function completeUserInputFlow() {
  answerQuestion("24");
  cy.contains("Next").click();
  pause();

  answerQuestion("Female");
  cy.contains("Next").click();
  pause();

  answerQuestion("165");
  cy.contains("Next").click();
  pause();

  answerQuestion("70");
  cy.contains("Next").click();
  pause();

  answerQuestion("60");
  cy.contains("Next").click();
  pause();

  answerQuestion("Moderately Active");
  cy.contains("Next").click();
  pause();

  answerQuestion("Fat Loss");
  cy.contains("Next").click();
  pause();

  answerQuestion("Vegetarian");
  cy.contains("Next").click();
  pause();

  answerQuestion("None");
  cy.contains("Next").click();
  pause();

  answerQuestion("3");
  cy.contains("Next").click();
  pause();

  answerQuestion("Indian");
  cy.contains("Next").click();
  pause();

  answerQuestion("None");
  cy.contains("Finish").click();
  pause();
}

describe("Dietify - Full application scenarios", () => {
  beforeEach(() => {
    clearBrowserState();
  });

  it("shows logo page first and redirects to home after about 2 seconds", () => {
    cy.visit("/");
    pause();

    cy.contains("Dietify").should("be.visible");
    cy.contains("Personalized nutrition made simple").should("be.visible");

    pause(2500);
    cy.url().should("include", "/home");
  });

  it("shows home page hero content correctly", () => {
    cy.visit("/home");
    pause();

    cy.contains("AI-powered wellness").should("be.visible");
    cy.contains("Eat better with a plan that feels personal.").should("be.visible");
    cy.contains("Get Started").should("be.visible");
    cy.contains("Why Dietify").should("be.visible");
    cy.contains("Privacy & Terms").should("be.visible");
  });

  it("shows cookie bar on home page and accepts cookies", () => {
    cy.visit("/home");
    pause();

    cy.contains("Cookie preferences").should("be.visible");
    cy.contains("Accept All").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("dietify_cookie_consent")).to.equal("accepted");
    });
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
  });

  it("navigates from home to about using Why Dietify", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Why Dietify").click();
    pause();

    cy.url().should("include", "/about");
  });

  it("navigates from home to legal page using Privacy & Terms", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Privacy & Terms").click();
    pause();

    cy.url().should("include", "/legal");
  });

  it("shows about page correctly and allows cookie selection", () => {
    cy.visit("/about");
    pause();

    cy.contains("Why Dietify").should("be.visible");
    cy.contains("Start Now").should("be.visible");
    cy.contains("Back Home").should("be.visible");
    cy.contains("Privacy & Terms").should("be.visible");
    cy.contains("Cookie preferences").should("be.visible");

    cy.contains("Essential Only").click();
    pause();

    cy.contains("Cookie preferences").should("not.exist");
  });

  it("navigates from about page to registration using Start Now", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Start Now").click();
    pause();

    cy.url().should("include", "/registration");
  });

  it("navigates from about page back home using Back Home", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Back Home").click();
    pause();

    cy.url().should("include", "/home");
  });

  it("navigates from about page to legal page using Privacy & Terms", () => {
    cy.visit("/about");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Privacy & Terms").click();
    pause();

    cy.url().should("include", "/legal");
  });

  it("shows legal page with privacy, terms, and contact sections", () => {
    cy.visit("/legal");
    pause();

    cy.contains("Privacy Policy & Terms").should("be.visible");
    cy.contains("Privacy Policy").should("be.visible");
    cy.contains("Terms & Conditions").should("be.visible");
    cy.contains("Contact").should("be.visible");
  });

  it("redirects unauthenticated user from /user-input to /registration", () => {
    cy.visit("/user-input");
    pause(2000);

    cy.url().should("include", "/registration");
  });

  it("redirects unauthenticated user from /result to /registration", () => {
    cy.visit("/result");
    pause(2000);

    cy.url().should("include", "/registration");
  });

  it("redirects unauthenticated user from /cart to /registration", () => {
    cy.visit("/cart");
    pause(2000);

    cy.url().should("include", "/registration");
  });

  it("shows error when register form is submitted empty", () => {
    cy.visit("/registration");
    pause();

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Please correct the highlighted fields.").should("be.visible");
  });

  it("shows error when full name contains only numbers", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("123456");
    cy.get("#email").type("numbers@test.com");
    cy.get("#password").type("Password123!");
    cy.get("#confirmPassword").type("Password123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Name can only contain letters and basic punctuation.").should("be.visible");
  });

  it("shows error when email format is invalid", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("invalid-email");
    cy.get("#password").type("Password123!");
    cy.get("#confirmPassword").type("Password123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Please enter a valid email address.").should("be.visible");
  });

  it("shows error when password is too short", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("shortpass@test.com");
    cy.get("#password").type("Ab1!");
    cy.get("#confirmPassword").type("Ab1!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Password must be at least 8 characters.").should("be.visible");
  });

  it("shows error when password has no uppercase letter", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("noupper@test.com");
    cy.get("#password").type("password123!");
    cy.get("#confirmPassword").type("password123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Include at least one uppercase letter.").should("be.visible");
  });

  it("shows error when password has no lowercase letter", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("nolower@test.com");
    cy.get("#password").type("PASSWORD123!");
    cy.get("#confirmPassword").type("PASSWORD123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Include at least one lowercase letter.").should("be.visible");
  });

  it("shows error when password has no number", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("nonumber@test.com");
    cy.get("#password").type("Password!!!");
    cy.get("#confirmPassword").type("Password!!!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Include at least one number.").should("be.visible");
  });

  it("shows error when password has no special character", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("nospecial@test.com");
    cy.get("#password").type("Password123");
    cy.get("#confirmPassword").type("Password123");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Include at least one special character.").should("be.visible");
  });

  it("shows error when confirm password does not match", () => {
    cy.visit("/registration");
    pause();

    cy.get("#fullName").type("Jeevitha R");
    cy.get("#email").type("nomatch@test.com");
    cy.get("#password").type("Password123!");
    cy.get("#confirmPassword").type("Password999!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("Passwords do not match.").should("be.visible");
  });

  it("toggles password visibility correctly", () => {
    cy.visit("/registration");
    pause();

    cy.get("#password").should("have.attr", "type", "password");
    cy.get('button[aria-label="Show password"]').click();
    pause();

    cy.get("#password").should("have.attr", "type", "text");
    cy.get('button[aria-label="Hide password"]').click();
    pause();

    cy.get("#password").should("have.attr", "type", "password");
  });

  it("registers a new user successfully", () => {
    registerUser("register.success@test.com");
    cy.contains("Registration successful").should("be.visible");
  });

  it("prevents duplicate email registration", () => {
    registerUser("duplicate@test.com");
    cy.contains("Registration successful").should("be.visible");
    pause();

    cy.get(".registration-toggle").contains("Register").click();
    pause();

    cy.get("#fullName").clear().type("Jeevitha R");
    cy.get("#email").clear().type("duplicate@test.com");
    cy.get("#password").clear().type("Password123!");
    cy.get("#confirmPassword").clear().type("Password123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();

    pause();
    cy.contains("An account with this email already exists. Please log in instead.")
      .should("be.visible");
  });

  it("logs in successfully with valid credentials", () => {
    registerAndLogin("login.success@test.com");
    cy.url().should("include", "/user-input");
  });

  it("shows error for invalid login credentials", () => {
    registerUser("invalid.login@test.com");
    pause();

    cy.get(".registration-toggle").contains("Login").click();
    pause();

    cy.get("#email").clear().type("invalid.login@test.com");
    cy.get("#password").clear().type("WrongPassword123!");

    cy.get("form.registration-form button[type='submit']")
      .contains("Login")
      .click();

    pause();
    cy.contains("Invalid email or password.").should("be.visible");
  });

  it("shows first onboarding question after login", () => {
    registerAndLogin("question.start@test.com");

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
  });

  it("shows validation error when required question is skipped", () => {
    registerAndLogin("question.required@test.com");

    cy.contains("Next").click();
    pause();

    cy.contains("Please answer this question before continuing.").should("be.visible");
  });

  it("shows age range validation error when age is below 16", () => {
    registerAndLogin("age.validation@test.com");

    answerQuestion("10");
    cy.contains("Next").click();
    pause();

    cy.contains("Age must be between 16 and 100.").should("be.visible");
  });

  it("allows navigating backwards in questionnaire", () => {
    registerAndLogin("back.button@test.com");

    answerQuestion("24");
    cy.contains("Next").click();
    pause();

    cy.contains("Back").click();
    pause();

    cy.contains("What is your age?").should("be.visible");
  });

  it("completes the full onboarding flow and reaches result page", () => {
    mockAiMealPlan();
    registerAndLogin("full.flow@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.url().should("include", "/result");
  });

  it("shows result metrics and weekly meal plan after completing questionnaire", () => {
    mockAiMealPlan();
    registerAndLogin("result.metrics@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Your personalized nutrition plan").should("be.visible");
    cy.contains("BMI").should("be.visible");
    cy.contains("Calories").should("be.visible");
    cy.contains("Protein").should("be.visible");
    cy.contains("Carbs").should("be.visible");
    cy.contains("Fats").should("be.visible");
    cy.contains("AI Nutrition Summary").should("be.visible");
    cy.contains("Weekly Meal Plan").should("be.visible");
    cy.contains("Monday").should("be.visible");
    cy.contains("Add Ingredients to Cart").should("be.visible");
    cy.contains("Open Shopping Cart").should("be.visible");
  });

  it("shows AI summary section and mocked meal plan safely", () => {
    mockAiMealPlan();
    registerAndLogin("result.safe@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("AI Nutrition Summary").should("be.visible");
    cy.contains("Weekly Meal Plan").should("be.visible");
    cy.contains("Monday").should("be.visible");
    cy.get(".meal-card").should("exist");
  });

  it("allows switching day tabs on result page", () => {
    mockAiMealPlan();
    registerAndLogin("day.tabs@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Weekly Meal Plan").should("be.visible");
    cy.contains("Tuesday").click();
    pause();

    cy.contains("Tuesday").should("be.visible");
  });

  it("adds ingredients to cart from a meal card", () => {
    mockAiMealPlan();
    registerAndLogin("add.cart@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("ingredients added to cart").should("be.visible");
  });

  it("updates result page View Cart count after adding ingredients", () => {
    mockAiMealPlan();
    registerAndLogin("result.cartcount@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains(/View Cart \(0\)/).should("be.visible");
    cy.contains("Add Ingredients to Cart").click();
    pause();

    cy.contains(/View Cart \([1-9]\d*\)/).should("be.visible");
  });

  it("opens cart from result page View Cart button", () => {
    mockAiMealPlan();
    registerAndLogin("result.viewcart@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("button", "View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    cy.contains("Your Shopping Cart").should("be.visible");
  });

  it("opens cart from result page Open Shopping Cart button", () => {
    mockAiMealPlan();
    registerAndLogin("result.openshoppingcart@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("button", "Open Shopping Cart").click();
    pause();

    cy.url().should("include", "/cart");
    cy.contains("Your Shopping Cart").should("be.visible");
  });

  it("goes back to user-input from result page back button", () => {
    mockAiMealPlan();
    registerAndLogin("result.back@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("button", "Back").click();
    pause();

    cy.url().should("include", "/user-input");
  });

  it("adds ingredients from available meal cards safely", () => {
    mockAiMealPlan();
    registerAndLogin("cart.multi.add@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.get("button")
      .filter(":contains('Add Ingredients to Cart')")
      .then(($buttons) => {
        expect($buttons.length).to.be.greaterThan(0);

        cy.wrap($buttons[0]).click({ force: true });
        pause();

        if ($buttons.length > 1) {
          cy.wrap($buttons[1]).click({ force: true });
          pause();
        }
      });

    cy.contains("button", "View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    cy.get(".cart-item-card").should("have.length.greaterThan", 0);
  });

  it("shows empty cart state when no items are added", () => {
    registerAndLogin("empty.cart@test.com");

    cy.visit("/cart");
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    cy.contains("Add ingredients from your meal plan to build your shopping list.").should(
      "be.visible"
    );
    cy.contains("button", "Go to Meal Plan").should("be.visible");
    cy.contains("button", "Back to Results").should("be.visible");
  });

  it("adds ingredients from result page and opens shopping cart with items", () => {
    mockAiMealPlan();
    registerAndLogin("cart.add.items@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("ingredients added to cart").should("be.visible");
    cy.contains("button", "View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    cy.contains("Your Shopping Cart").should("be.visible");
    cy.get(".cart-item-card").should("have.length.greaterThan", 0);
  });

  it("shows cart items after adding ingredients", () => {
    mockAiMealPlan();
    registerAndLogin("cart.items@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.contains("Your Shopping Cart").should("be.visible");
    cy.contains("Download PDF").should("be.visible");
    cy.contains("Download Excel").should("be.visible");
    cy.contains("Clear Cart").should("be.visible");
    cy.contains("Back to Results").should("be.visible");
  });

  it("returns to result page from cart back button", () => {
    mockAiMealPlan();
    registerAndLogin("cart.back@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("button", "Open Shopping Cart").click();
    pause();

    cy.contains("button", "Back to Results").click();
    pause();

    cy.url().should("include", "/result");
    cy.contains("Your personalized nutrition plan").should("be.visible");
  });

  it("returns to result page from empty cart Go to Meal Plan button", () => {
    mockAiMealPlan();
    registerAndLogin("cart.empty.back@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/cart");
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    cy.contains("button", "Go to Meal Plan").click();
    pause();

    cy.url().should("include", "/result");
  });

  it("increases and decreases quantity in cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.qty@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.get(".qty-value")
      .first()
      .invoke("text")
      .then((beforeText) => {
        const before = Number(beforeText.trim());

        cy.get(".qty-btn").last().click();
        pause();

        cy.get(".qty-value")
          .first()
          .invoke("text")
          .then((afterIncreaseText) => {
            const afterIncrease = Number(afterIncreaseText.trim());
            expect(afterIncrease).to.be.greaterThan(before);
          });

        cy.get(".qty-btn").first().click();
        pause();
      });
  });

  it("removes a single ingredient from cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.remove.one@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.get(".cart-item-card")
      .its("length")
      .then((countBefore) => {
        cy.contains("button", "Remove").first().click();
        pause();

        if (countBefore > 1) {
          cy.get(".cart-item-card").should("have.length", countBefore - 1);
        } else {
          cy.contains("Your cart is empty").should("be.visible");
        }
      });
  });

  it("shows and triggers PDF download from cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.download.pdf@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.contains("button", "Download PDF").should("be.visible").click();
    pause();

    cy.contains("Your Shopping Cart").should("be.visible");
  });

  it("shows and triggers Excel download from cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.download.excel@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.contains("button", "Download Excel").should("be.visible").click();
    pause();

    cy.contains("Your Shopping Cart").should("be.visible");
  });

  it("clears all items from cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.clear.all@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.contains("button", "Clear Cart").click();
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    cy.contains("Add ingredients from your meal plan to build your shopping list.").should(
      "be.visible"
    );
  });

  it("preserves cart items after navigating back and reopening cart", () => {
    mockAiMealPlan();
    registerAndLogin("cart.persist.items@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").should("be.visible").click();
    pause();

    cy.contains("button", "View Cart").click();
    pause();

    cy.get(".cart-item-card").should("have.length.greaterThan", 0);

    cy.go("back");
    pause();

    cy.url().should("include", "/result");

    cy.contains("button", "View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    cy.get(".cart-item-card").should("have.length.greaterThan", 0);
  });

  it("shows session actions on registration page when user is already logged in", () => {
    registerAndLogin("saved.session@test.com");

    cy.visit("/registration");
    pause();

    cy.contains("Logged in as").should("be.visible");
    cy.contains("Continue").should("be.visible");
    cy.contains("Logout").should("be.visible");
    cy.contains("Delete Profile").should("be.visible");
  });

  it("continues to user-input from registration session box", () => {
    registerAndLogin("session.continue@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box").should("be.visible");
    cy.get(".session-box").contains("button", "Continue").click();
    pause();

    cy.url().should("include", "/user-input");
  });

  it("logs out from registration session box and shows form again", () => {
    registerAndLogin("session.logout@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box").contains("button", "Logout").click();
    pause();

    cy.contains("You have been logged out.").should("be.visible");
    cy.contains("Create Account").should("be.visible");
  });

  it("deletes profile from registration session box and returns to register form", () => {
    registerAndLogin("session.delete@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box").contains("button", "Delete Profile").click();
    pause();

    cy.contains("Local profile deleted.").should("be.visible");
    cy.contains("Create Account").should("be.visible");
  });

  it("shows saved profile card when user reopens user-input after finishing profile", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("Profile already saved").should("be.visible");
    cy.contains("button", "Continue").should("be.visible");
    cy.contains("button", "Update Answers").should("be.visible");
    cy.contains("button", "Reset Answers").should("be.visible");
  });

  it("continues with saved profile from user-input saved card", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.continue@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("button", "Continue").click();
    pause();

    cy.url().should("include", "/result");
  });

  it("opens questionnaire again when user chooses Update Answers", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.update@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("button", "Update Answers").click();
    pause();

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
  });

  it("resets saved answers and returns user to fresh questionnaire", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.reset@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("button", "Reset Answers").click();
    pause();

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
    cy.contains("Profile already saved").should("not.exist");
  });

  it("shows existing profile options when reopening app after finishing everything", () => {
    mockAiMealPlan();
    registerAndLogin("existing.profile@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/home");
    pause();

    cy.contains("Get Started").click();
    pause();

    cy.contains("Logged in as").should("be.visible");
    cy.contains("Continue").should("be.visible");
    cy.contains("Logout").should("be.visible");
    cy.contains("Delete Profile").should("be.visible");
  });

  it("supports browser back navigation from registration to home", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Get Started").click();
    pause();

    cy.url().should("include", "/registration");

    cy.go("back");
    pause();

    cy.url().should("include", "/home");
  });

  it("supports back button inside questionnaire flow", () => {
    registerAndLogin("browser.back.flow@test.com");

    answerQuestion("24");
    cy.contains("Next").click();
    pause();

    answerQuestion("Female");
    cy.contains("Next").click();
    pause();

    cy.contains("Back").click();
    pause();

    cy.contains("What is your gender?").should("be.visible");

    cy.contains("Back").click();
    pause();

    cy.contains("What is your age?").should("be.visible");
  });

  it("shows page not found for unknown routes", () => {
    cy.visit("/some-random-route", { failOnStatusCode: false });
    pause();

    cy.contains("Page Not Found").should("be.visible");
  });
});