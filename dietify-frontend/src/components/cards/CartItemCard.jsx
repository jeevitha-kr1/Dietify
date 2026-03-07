export default function CartItemCard({ item, onRemove }) {
  return (
    <article className="cart-item-card">
      <div>
        <h3>{item.name}</h3>
        <p>
          {item.quantity} {item.unit}
        </p>
      </div>

      <button type="button" onClick={() => onRemove(item.name)}>
        Remove
      </button>
    </article>
  );
}