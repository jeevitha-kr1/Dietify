export function mergeIngredients(existingCart, newIngredients) {
  const mergedMap = new Map();

  existingCart.forEach((item) => {
    mergedMap.set(item.name.toLowerCase(), { ...item });
  });

  newIngredients.forEach((ingredient) => {
    const normalizedName = ingredient.name.toLowerCase();

    if (mergedMap.has(normalizedName)) {
      const existingItem = mergedMap.get(normalizedName);
      mergedMap.set(normalizedName, {
        ...existingItem,
        quantity: existingItem.quantity + ingredient.quantity,
      });
    } else {
         mergedMap.set(normalizedName, { ...ingredient });
    }
  });

  return Array.from(mergedMap.values());
}
