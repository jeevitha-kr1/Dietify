import * as XLSX from "xlsx";

export function exportCartToExcel(cartItems) {
  const rows = cartItems.map((item) => ({
    Ingredient: item.name,
    Quantity: item.quantity,
    Unit: item.unit,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Dietify Cart");
  XLSX.writeFile(workbook, "dietify-cart.xlsx");
}