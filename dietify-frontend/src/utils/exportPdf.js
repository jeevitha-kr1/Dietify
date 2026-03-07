import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCartToPdf(cartItems) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Dietify Shopping Cart", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Ingredient", "Quantity", "Unit"]],
    body: cartItems.map((item) => [
      item.name,
      item.quantity,
      item.unit,
    ]),
  });

  doc.save("dietify-cart.pdf");
}