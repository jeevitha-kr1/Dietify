export default function RecipeCard({ recipe, onAddIngredients }) {
  return (
    <article className="recipe-card">
      <p className="recipe-card__type">{recipe.mealType}</p>
      <h3>{recipe.name}</h3>
      <p>{recipe.calories} kcal</p>

      <ul>
        {recipe.ingredients?.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>

      <button type="button" onClick={() => onAddIngredients(recipe)}>
        Add ingredients to cart
      </button>
    </article>
  );
}