const KEY = "dietify_prefs";

export function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { theme: "system", lang: "en" };
  } catch {
    return { theme: "system", lang: "en" };
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}