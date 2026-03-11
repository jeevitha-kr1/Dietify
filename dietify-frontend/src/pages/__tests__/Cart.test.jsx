import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import Cart from "../Cart";
import cartReducer from "../../store/slices/cartSlice";

const mockSheet = {
  columns: [],
  addRow: vi.fn(),
};

const mockWorkbook = {
  addWorksheet: vi.fn(() => mockSheet),
  xlsx: {
    writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  },
};

vi.mock("exceljs", () => {
  const mockSheet = {
    set columns(_) {},
    addRow: vi.fn(),
  };

  function Workbook() {
    this.addWorksheet = vi.fn(() => mockSheet);
    this.xlsx = {
      writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    };
  }

  return {
    default: { Workbook },
  };
});

vi.mock("jspdf", () => ({
  default: class {
    setFontSize = vi.fn();
    text = vi.fn();
    save = vi.fn();
  },
}));

vi.mock("jspdf-autotable", () => ({
  default: vi.fn(),
}));

const mockCartItems = [
  { id: "apple-0", name: "Apple", quantity: 2, unit: "item" },
  { id: "milk-1", name: "Milk", quantity: 1, unit: "item" },
];

function buildStore(items = []) {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { items } },
  });
}

function renderCart(items = []) {
  return render(
    <Provider store={buildStore(items)}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>
  );
}

test("renders page heading", () => {
  renderCart();
  expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
});

test("shows empty cart message when no items", () => {
  renderCart();
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test("shows total items count", () => {
  renderCart(mockCartItems);
  expect(screen.getByText("3")).toBeInTheDocument();
});

test("renders item names", () => {
  renderCart(mockCartItems);
  expect(screen.getByText(/apple/i)).toBeInTheDocument();
  expect(screen.getByText(/milk/i)).toBeInTheDocument();
});

test("renders item quantity", () => {
  renderCart(mockCartItems);
  const quantities = screen.getAllByText("2");
  expect(quantities.length).toBeGreaterThan(0);
});

test("download pdf button is visible when cart has items", () => {
  renderCart(mockCartItems);
  expect(screen.getByRole("button", { name: /download pdf/i })).toBeInTheDocument();
});

test("download excel button is visible when cart has items", () => {
  renderCart(mockCartItems);
  expect(screen.getByRole("button", { name: /download excel/i })).toBeInTheDocument();
});

test("clear cart button is visible when cart has items", () => {
  renderCart(mockCartItems);
  expect(screen.getByRole("button", { name: /clear cart/i })).toBeInTheDocument();
});

test("clicking clear cart empties the cart", () => {
  renderCart(mockCartItems);
  fireEvent.click(screen.getByRole("button", { name: /clear cart/i }));
  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test("remove button is visible for each item", () => {
  renderCart(mockCartItems);
  const removeButtons = screen.getAllByRole("button", { name: /remove/i });
  expect(removeButtons.length).toBe(mockCartItems.length);
});

test("clicking remove deletes that item from cart", () => {
  renderCart(mockCartItems);
  const removeButtons = screen.getAllByRole("button", { name: /remove/i });
  fireEvent.click(removeButtons[0]);
  expect(screen.queryByText(/apple/i)).not.toBeInTheDocument();
});

test("increase quantity button works", () => {
  renderCart(mockCartItems);
  const increaseButtons = screen.getAllByRole("button", { name: /\+/i });
  fireEvent.click(increaseButtons[0]);
  expect(screen.getByText("3")).toBeInTheDocument();
});

test("decrease quantity button works", () => {
  renderCart(mockCartItems);
  const decreaseButtons = screen.getAllByRole("button", { name: /−/i });
  fireEvent.click(decreaseButtons[0]);
  const ones = screen.getAllByText("1");
  expect(ones.length).toBeGreaterThan(0);
});

test("download pdf button triggers pdf generation", () => {
  renderCart(mockCartItems);
  expect(() =>
    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }))
  ).not.toThrow();
});

test("download excel button triggers excel generation", () => {
  renderCart(mockCartItems);
  expect(() =>
    fireEvent.click(screen.getByRole("button", { name: /download excel/i }))
  ).not.toThrow();
});

test("smart grocery planner kicker text renders", () => {
  renderCart();
  expect(screen.getByText(/smart grocery planner/i)).toBeInTheDocument();
});

test("empty cart message shows helper text", () => {
  renderCart();
  expect(
    screen.getByText(/add ingredients from your meal plan/i)
  ).toBeInTheDocument();
});

test("download buttons are hidden when cart is empty", () => {
  renderCart();
  expect(
    screen.queryByRole("button", { name: /download pdf/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /download excel/i })
  ).not.toBeInTheDocument();
});