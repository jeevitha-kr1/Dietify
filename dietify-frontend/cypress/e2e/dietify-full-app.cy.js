// IMPORTANT: In Result/cart flows mocked Gemini response is used so tests stay stable


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
    days: [
      {
        day: "Monday",
        dailyCalories: 1600,
        meals: {
          breakfast: {
            title: "Oats with banana and almonds",
            calories: 350,
            ingredients: ["Oats", "Banana", "Milk", "Almonds"],
          },
          lunch: {
            title: "Rice with dal and vegetables",
            calories: 550,
            ingredients: ["Rice", "Dal", "Carrot", "Beans", "Onion"],
          },
          dinner: {
            title: "Paneer salad bowl",
            calories: 420,
            ingredients: ["Paneer", "Cucumber", "Tomato", "Lettuce"],
          },
          snack: {
            title: "Apple with peanut butter",
            calories: 200,
            ingredients: ["Apple", "Peanut Butter"],
          },
        },
      },
      {
        day: "Tuesday",
        dailyCalories: 1580,
        meals: {
          breakfast: {
            title: "Greek yogurt bowl",
            calories: 320,
            ingredients: ["Greek Yogurt", "Berries", "Chia Seeds"],
          },
          lunch: {
            title: "Vegetable quinoa bowl",
            calories: 540,
            ingredients: ["Quinoa", "Broccoli", "Capsicum", "Corn"],
          },
          dinner: {
            title: "Tofu stir fry",
            calories: 430,
            ingredients: ["Tofu", "Bell Pepper", "Soy Sauce", "Onion"],
          },
          snack: {
            title: "Mixed nuts",
            calories: 180,
            ingredients: ["Almonds", "Walnuts", "Cashews"],
          },
        },
      },
      {
        day: "Wednesday",
        dailyCalories: 1620,
        meals: {
          breakfast: {
            title: "Smoothie bowl",
            calories: 340,
            ingredients: ["Banana", "Spinach", "Milk", "Oats"],
          },
          lunch: {
            title: "Chickpea salad",
            calories: 500,
            ingredients: ["Chickpeas", "Tomato", "Cucumber", "Lemon"],
          },
          dinner: {
            title: "Vegetable wrap",
            calories: 450,
            ingredients: ["Tortilla", "Paneer", "Lettuce", "Tomato"],
          },
          snack: {
            title: "Fruit mix",
            calories: 190,
            ingredients: ["Apple", "Orange", "Grapes"],
          },
        },
      },
      {
        day: "Thursday",
        dailyCalories: 1590,
        meals: {
          breakfast: {
            title: "Avocado toast",
            calories: 330,
            ingredients: ["Bread", "Avocado", "Pepper Flakes"],
          },
          lunch: {
            title: "Brown rice bowl",
            calories: 560,
            ingredients: ["Brown Rice", "Beans", "Carrot", "Peas"],
          },
          dinner: {
            title: "Lentil soup",
            calories: 410,
            ingredients: ["Lentils", "Onion", "Garlic", "Tomato"],
          },
          snack: {
            title: "Roasted seeds",
            calories: 170,
            ingredients: ["Pumpkin Seeds", "Sunflower Seeds"],
          },
        },
      },
      {
        day: "Friday",
        dailyCalories: 1610,
        meals: {
          breakfast: {
            title: "Peanut butter oats",
            calories: 360,
            ingredients: ["Oats", "Peanut Butter", "Milk"],
          },
          lunch: {
            title: "Veg pulao",
            calories: 540,
            ingredients: ["Rice", "Beans", "Carrot", "Peas"],
          },
          dinner: {
            title: "Grilled paneer plate",
            calories: 430,
            ingredients: ["Paneer", "Capsicum", "Onion", "Cucumber"],
          },
          snack: {
            title: "Banana",
            calories: 120,
            ingredients: ["Banana"],
          },
        },
      },
      {
        day: "Saturday",
        dailyCalories: 1570,
        meals: {
          breakfast: {
            title: "Idli and chutney",
            calories: 300,
            ingredients: ["Idli Batter", "Coconut", "Green Chili"],
          },
          lunch: {
            title: "Dal khichdi",
            calories: 560,
            ingredients: ["Rice", "Dal", "Turmeric", "Onion"],
          },
          dinner: {
            title: "Vegetable soup and toast",
            calories: 400,
            ingredients: ["Carrot", "Beans", "Bread", "Pepper"],
          },
          snack: {
            title: "Curd cup",
            calories: 160,
            ingredients: ["Curd"],
          },
        },
      },
      {
        day: "Sunday",
        dailyCalories: 1630,
        meals: {
          breakfast: {
            title: "Poha bowl",
            calories: 320,
            ingredients: ["Poha", "Peanuts", "Onion", "Curry Leaves"],
          },
          lunch: {
            title: "Paneer rice bowl",
            calories: 580,
            ingredients: ["Rice", "Paneer", "Tomato", "Onion"],
          },
          dinner: {
            title: "Salad plate",
            calories: 390,
            ingredients: ["Lettuce", "Tomato", "Cucumber", "Olives"],
          },
          snack: {
            title: "Dates and nuts",
            calories: 180,
            ingredients: ["Dates", "Almonds"],
          },
        },
      },
    ],
    tips: [
      "Drink water consistently through the day.",
      "Keep meal timings regular.",
      "Include protein in every main meal.",
    ],
    groceryList: [
      { name: "Oats", quantity: 1, unit: "pack" },
      { name: "Rice", quantity: 2, unit: "kg" },
      { name: "Paneer", quantity: 500, unit: "g" },
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
  pause();

  cy.get("#email").clear().type(email);
  pause();

  cy.get("#password").clear().type("Password123!");
  pause();

  cy.get("#confirmPassword").clear().type("Password123!");
  pause();

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
  pause();

  cy.get("#password").clear().type("Password123!");
  pause();

  cy.get("form.registration-form button[type='submit']")
    .contains("Login")
    .click();
  pause();

  cy.url().should("include", "/user-input");
  pause();
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
  // Q1 Age
  answerQuestion("24");
  cy.contains("Next").click();
  pause();

  // Q2 Gender
  answerQuestion("Female");
  cy.contains("Next").click();
  pause();

  // Q3 Height
  answerQuestion("165");
  cy.contains("Next").click();
  pause();

  // Q4 Weight
  answerQuestion("70");
  cy.contains("Next").click();
  pause();

  // Q5 Target Weight
  answerQuestion("60");
  cy.contains("Next").click();
  pause();

  // Q6 Activity level
  answerQuestion("Moderately Active");
  cy.contains("Next").click();
  pause();

  // Q7 Goal
  answerQuestion("Fat Loss");
  cy.contains("Next").click();
  pause();

  // Q8 Diet preference
  answerQuestion("Vegetarian");
  cy.contains("Next").click();
  pause();

  // Q9 Allergies
  answerQuestion("None");
  cy.contains("Next").click();
  pause();

  // Q10 Meals per day
  answerQuestion("3");
  cy.contains("Next").click();
  pause();

  // Q11 Preferred cuisine
  answerQuestion("Indian");
  cy.contains("Next").click();
  pause();

  // Q12 Health conditions
  answerQuestion("None");
  cy.contains("Finish").click();
  pause();
}

describe("Dietify - Full application scenarios in one file", () => {
  beforeEach(() => {
    clearBrowserState();
  });

  
  // 1. LOGO PAGE SCENARIOS
 

  it("shows logo page first and then redirects to home after about 2 seconds", () => {
    cy.visit("/");
    pause();

    cy.contains("Dietify").should("be.visible");
    cy.contains("Personalized nutrition made simple").should("be.visible");
    pause(2500);

    cy.url().should("include", "/home");
    pause();
  });

  
  // 2. HOME PAGE SCENARIOS
  

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

  
  // 3. ABOUT PAGE SCENARIOS
  

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

  
  // 4. LEGAL PAGE SCENARIOS
  

  it("shows legal page with privacy, terms, and contact sections", () => {
    cy.visit("/legal");
    pause();

    cy.contains("Privacy Policy & Terms").should("be.visible");
    cy.contains("Privacy Policy").should("be.visible");
    cy.contains("Terms & Conditions").should("be.visible");
    cy.contains("Contact").should("be.visible");
    pause();
  });

  
  // 5. PROTECTED ROUTE SCENARIOS
  

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

  
  // 6. REGISTRATION VALIDATION SCENARIOS
  

  it("shows error when register form is submitted empty", () => {
    cy.visit("/registration");
    pause();

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
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

  
  // 7. REGISTRATION + LOGIN SCENARIOS
  

  it("registers a new user successfully", () => {
    registerUser("register.success@test.com");

    cy.contains("Registration successful").should("be.visible");
    pause();
  });

  it("prevents duplicate email registration", () => {
    registerUser("duplicate@test.com");
    cy.contains("Registration successful").should("be.visible");
    pause();

    cy.get(".registration-toggle").contains("Register").click();
    pause();

    cy.get("#fullName").clear().type("Jeevitha R");
    pause();

    cy.get("#email").clear().type("duplicate@test.com");
    pause();

    cy.get("#password").clear().type("Password123!");
    pause();

    cy.get("#confirmPassword").clear().type("Password123!");
    pause();

    cy.get("form.registration-form button[type='submit']")
      .contains("Create Account")
      .click();
    pause();

    cy.contains("An account with this email already exists. Please log in instead.")
      .should("be.visible");
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

    cy.get(".registration-toggle").contains("Login").click();
    pause();

    cy.get("#email").clear().type("invalid.login@test.com");
    pause();

    cy.get("#password").clear().type("WrongPassword123!");
    pause();

    cy.get("form.registration-form button[type='submit']")
      .contains("Login")
      .click();
    pause();

    cy.contains("Invalid email or password.").should("be.visible");
    pause();
  });

  
  // 8. USER INPUT QUESTIONNAIRE SCENARIOS
  

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

    answerQuestion("10");
    cy.contains("Next").click();
    pause();

    cy.contains("Age must be between 16 and 100.").should("be.visible");
    pause();
  });

  it("allows navigating backwards in questionnaire", () => {
    registerAndLogin("back.button@test.com");

    answerQuestion("24");
    cy.contains("Next").click();
    pause();

    cy.contains("Back").click();
    pause();

    cy.contains("What is your age?").should("be.visible");
    pause();
  });

  it("completes the full onboarding flow and reaches result page", () => {
    mockAiMealPlan();
    registerAndLogin("full.flow@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.url().should("include", "/result");
    pause();
  });

  
  // 9. RESULT PAGE SCENARIOS
  

  it("shows result metrics and weekly meal plan after completing questionnaire", () => {
    mockAiMealPlan();
    registerAndLogin("result.metrics@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

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
    cy.contains("Monday").should("be.visible");
    cy.contains("Add Ingredients to Cart").should("be.visible");
    pause();
  });

  it("shows AI summary section and mocked meal plan safely", () => {
    mockAiMealPlan();
    registerAndLogin("result.safe@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("AI Nutrition Summary").should("be.visible");
    cy.contains("Weekly Meal Plan").should("be.visible");
    cy.contains("Monday").should("be.visible");
    cy.get(".meal-card").should("have.length.greaterThan", 0);
    pause();
  });

  it("allows switching day tabs on result page when available", () => {
    mockAiMealPlan();
    registerAndLogin("day.tabs@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Weekly Meal Plan").should("be.visible");
    pause();

    cy.contains("Tuesday").click();
    pause();

    cy.contains("Tuesday").should("be.visible");
    pause();
  });

  it("handles result page cart action when ingredients are available", () => {
    mockAiMealPlan();
    registerAndLogin("add.cart@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("ingredients added to cart").should("be.visible");
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.url().should("include", "/cart");
    pause();
  });

  
  // 10. CART PAGE SCENARIOS
  

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

  it("shows cart items after adding ingredients when available", () => {
    mockAiMealPlan();
    registerAndLogin("cart.items@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Your Shopping Cart").should("be.visible");
    cy.contains("Download PDF").should("be.visible");
    cy.contains("Download Excel").should("be.visible");
    pause();
  });

  it("allows increasing and decreasing quantity in cart when items exist", () => {
    mockAiMealPlan();
    registerAndLogin("cart.qty@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.get(".qty-btn").last().click();
    pause();

    cy.get(".qty-btn").first().click();
    pause();
  });

  it("allows removing items from cart when items exist", () => {
    mockAiMealPlan();
    registerAndLogin("cart.remove@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Remove").first().click();
    pause();
  });

  it("shows export and clear cart actions when cart has items", () => {
    mockAiMealPlan();
    registerAndLogin("cart.export@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Download PDF").should("be.visible");
    cy.contains("Download Excel").should("be.visible");
    cy.contains("Clear Cart").should("be.visible");
    pause();
  });

  it("clears the cart successfully when items exist", () => {
    mockAiMealPlan();
    registerAndLogin("cart.clear@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.contains("Add Ingredients to Cart").first().click();
    pause();

    cy.contains("View Cart").click();
    pause();

    cy.contains("Clear Cart").click();
    pause();

    cy.contains("Your cart is empty").should("be.visible");
    pause();
  });

  
  // 11. SAVED SESSION / SAVED PROFILE SCENARIOS
  

  it("shows session actions on registration page when user is already logged in", () => {
    registerAndLogin("saved.session@test.com");

    cy.visit("/registration");
    pause();

    cy.contains("Logged in as").should("be.visible");
    cy.contains("Continue").should("be.visible");
    cy.contains("Logout").should("be.visible");
    cy.contains("Delete Profile").should("be.visible");
    pause();
  });

  it("continues to user-input from registration session box", () => {
    registerAndLogin("session.continue@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box").should("be.visible");
    pause();

    cy.get(".session-box")
      .contains("button", "Continue")
      .click();
    pause();

    cy.url().should("include", "/user-input");
    pause();
  });

  it("logs out from registration session box and shows form again", () => {
    registerAndLogin("session.logout@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box")
      .contains("button", "Logout")
      .click();
    pause();

    cy.contains("You have been logged out.").should("be.visible");
    cy.contains("Create Account").should("be.visible");
    pause();
  });

  it("deletes profile from registration session box and returns to register form", () => {
    registerAndLogin("session.delete@test.com");

    cy.visit("/registration");
    pause();

    cy.get(".session-box")
      .contains("button", "Delete Profile")
      .click();
    pause();

    cy.contains("Local profile deleted.").should("be.visible");
    cy.contains("Create Account").should("be.visible");
    pause();
  });

  it("shows saved profile card when user reopens user-input after finishing profile", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("Profile already saved").should("be.visible");
    cy.contains("Continue").should("be.visible");
    cy.contains("Update Answers").should("be.visible");
    cy.contains("Reset Saved Answers").should("be.visible");
    pause();
  });

  it("continues with saved profile from user-input saved card", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.continue@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("Continue").click();
    pause();

    cy.url().should("include", "/result");
    pause();
  });

  it("opens questionnaire again when user chooses Update Answers", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.update@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("Update Answers").click();
    pause();

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
    pause();
  });

  it("resets saved answers and returns user to fresh questionnaire", () => {
    mockAiMealPlan();
    registerAndLogin("saved.profile.reset@test.com");

    completeUserInputFlow();
    cy.wait("@generateMealPlan");

    cy.visit("/user-input");
    pause();

    cy.contains("Reset Saved Answers").click();
    pause();

    cy.contains("Question 1 of").should("be.visible");
    cy.contains("What is your age?").should("be.visible");
    cy.contains("Profile already saved").should("not.exist");
    pause();
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
    pause();
  });

  
  // 12. BROWSER BACK / NAVIGATION COVERAGE
  

  it("supports browser back navigation from registration to home", () => {
    cy.visit("/home");
    pause();

    cy.contains("Accept All").click();
    pause();

    cy.contains("Get Started").click();
    pause();

    cy.url().should("include", "/registration");
    pause();

    cy.go("back");
    pause();

    cy.url().should("include", "/home");
    pause();
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
    pause();

    cy.contains("Back").click();
    pause();

    cy.contains("What is your age?").should("be.visible");
    pause();
  });

  
  // 13. UNKNOWN ROUTE SCENARIO
  

  it("shows page not found for unknown routes", () => {
    cy.visit("/some-random-route", { failOnStatusCode: false });
    pause();

    cy.contains("Page Not Found").should("be.visible");
    pause();
  });
});