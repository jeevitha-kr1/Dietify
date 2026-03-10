import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import "../styles/Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  async function handleDownloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Shopping List");

    sheet.columns = [
      { header: "Sl No", key: "SlNo", width: 8 },
      { header: "Ingredient", key: "Ingredient", width: 28 },
      { header: "Quantity", key: "Quantity", width: 12 },
      { header: "Unit", key: "Unit", width: 12 },
    ];

    cartItems.forEach((item, index) => {
      sheet.addRow({
        SlNo: index + 1,
        Ingredient: item.name,
        Quantity: item.quantity,
        Unit: item.unit,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dietify-shopping-list.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Dietify Shopping List", 14, 18);
    autoTable(doc, {
      startY: 28,
      head: [["#", "Ingredient", "Quantity", "Unit"]],
      body: cartItems.map((item, index) => [
        index + 1,
        item.name,
        item.quantity,
        item.unit,
      ]),
    });
    doc.save("dietify-shopping-list.pdf");
  }

  return (
    <main className="cart-page">
      <section className="cart-shell">
        <div className="cart-header">
          <div>
            <p className="cart-kicker">Smart Grocery Planner</p>
            <h1>Your Shopping Cart</h1>
            <p className="cart-subtitle">
              Review ingredients added from your weekly meal plan and download them as PDF or Excel.
            </p>
          </div>
          <div className="cart-summary-card">
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add ingredients from your meal plan to build your shopping list.</p>
          </div>
        ) : (
          <>
            <div className="cart-actions">
              <button className="primary-btn" onClick={handleDownloadPDF}>
                Download PDF
              </button>
              <button className="secondary-btn" onClick={handleDownloadExcel}>
                Download Excel
              </button>
              <button className="danger-btn" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </button>
            </div>

            <div className="cart-grid">
              {cartItems.map((item) => (
                <article className="cart-item-card" key={item.id}>
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.unit}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-qty-row">
                    <button
                      className="qty-btn"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}