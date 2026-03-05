import { apiPost } from "./client";
export function cartFromMealPlan(mealPlan) {
  return apiPost("/api/cart/from-plan", { mealPlan });
}