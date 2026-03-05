import { apiPost } from "./client";

export async function saveUserAnswers(answers) {
  return apiPost("/api/profile", answers);
}

// We store answers in backend DB as JSON string.