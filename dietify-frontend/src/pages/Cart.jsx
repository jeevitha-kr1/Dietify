import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";

import { exportCartToExcel } from "../utils/exportExcel";
import { exportCartToPdf } from "../utils/exportPdf";

import "../styles/Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemove = (itemName) => {
    dispatch(removeFromCart(itemName));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleExportExcel = () => {
    exportCartToExcel(cartItems);
  };

  const handleExportPdf = () => {
    exportCartToPdf(cartItems);
  };

  return (
    <main className="cart-page">
      <section className="cart-card">
        <div className="cart-header">
          <div>
            <p className="cart-kicker">Dietify Cart</p>
            <h1>Your Ingredient List</h1>
            <p className="cart-subtitle">
              This cart stores ingredients from your selected recipes, ready for shopping or export.
            </p>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/result")}
          >
            Back to Results
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>
              Add ingredients from recommended recipes on the results page to build your shopping list.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate("/result")}
            >
              Go to Results
            </button>
          </div>
        ) : (
          <>
            <div className="cart-toolbar">
              <p className="cart-count">
                {cartItems.length} ingredient{cartItems.length > 1 ? "s" : ""} in cart
              </p>

              <div className="cart-toolbar-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleExportExcel}
                >
                  Export Excel
                </button>

                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleExportPdf}
                >
                  Export PDF
                </button>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="cart-list">
              {cartItems.map((item) => (
                <article key={item.name} className="cart-item">
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>
                      Quantity: <strong>{item.quantity}</strong> {item.unit}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => handleRemove(item.name)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}