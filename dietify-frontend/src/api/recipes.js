import { apiPost } from "./client";

export function generateRecipes(answers) {
  return apiPost("/api/recipes/generate", { answers });
}