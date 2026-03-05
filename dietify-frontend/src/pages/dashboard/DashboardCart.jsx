import { useMemo, useState } from "react";

const SAVED_KEY = "dietify_saved_recipes_v1";
const CART_KEY = "dietify_cart_v1";

function readSavedRecipes() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function DashboardCart() {
  const saved = useMemo(() => readSavedRecipes(), []);
  const [cart, setCart] = useState(readCart());
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  const addItem = () => {
    if (!name.trim()) return;
    const next = [{ name: name.trim(), qty: qty.trim() || "1", checked: false }, ...cart];
    setCart(next);
    writeCart(next);
    setName("");
    setQty("");
  };

  const toggle = (idx) => {
    const next = cart.map((c, i) => (i === idx ? { ...c, checked: !c.checked } : c));
    setCart(next);
    writeCart(next);
  };

  const remove = (idx) => {
    const next = cart.filter((_, i) => i !== idx);
    setCart(next);
    writeCart(next);
  };

  const addRecipeIngredients = (recipe) => {
    const items = (recipe.ingredients || []).map((i) => ({ name: i.name, qty: i.qty, checked: false }));
    const next = [...items, ...cart];
    setCart(next);
    writeCart(next);
    alert("Added ingredients to cart ✅");
  };

  return (
    <div className="dash-page">
      <div className="dash-page-head">
        <div>
          <h1 className="dash-h1">Cart</h1>
          <p className="dash-sub">Build a shopping list. Export PDF/Excel comes next.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-title">Add item</div>
          <div className="dash-formrow">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Tomatoes" />
            <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g., 2 pcs" />
            <button className="dash-primary" onClick={addItem}>Add</button>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Saved recipes</div>
          <div className="dash-mini">Tap to add ingredients.</div>
          <div className="dash-saved">
            {saved.length === 0 && <div className="dash-mini">No saved recipes yet.</div>}
            {saved.slice(0, 6).map((r) => (
              <button key={r.id + r.savedAt} className="dash-saved-item" onClick={() => addRecipeIngredients(r)}>
                {r.title}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-title">Your cart</div>
          <ul className="dash-list">
            {cart.length === 0 && <li className="dash-mini">Cart is empty.</li>}
            {cart.map((it, idx) => (
              <li key={idx} className="dash-cart-item">
                <label className="dash-check">
                  <input type="checkbox" checked={!!it.checked} onChange={() => toggle(idx)} />
                  <span>{it.name} — {it.qty}</span>
                </label>
                <button className="dash-x" onClick={() => remove(idx)}>✕</button>
              </li>
            ))}
          </ul>

          <div className="dash-mini" style={{ marginTop: 10 }}>
            Export: PDF/Excel will be connected to backend in the next step.
          </div>
        </div>
      </div>
    </div>
  );
}