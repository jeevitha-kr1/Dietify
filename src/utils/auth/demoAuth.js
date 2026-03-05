// src/utils/auth/demoAuth.js
// Demo auth that NEVER stores raw passwords.
// Stores: profile + { salt, passwordHash } in localStorage.

const USER_KEY = "dietify_user_v1";

function bufToHex(buffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function randomSaltHex(bytes = 16) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest("SHA-256", enc);
  return bufToHex(hashBuf);
}

export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export async function registerUser({ firstName, lastName, email, phone, gender, password }) {
  const salt = randomSaltHex(16);
  // Store a salted hash, never the password
  const passwordHash = await sha256Hex(`${salt}:${password}`);

  const user = {
    firstName,
    lastName,
    email,
    phone,
    gender,
    auth: { salt, passwordHash }, // ✅ safe for demo; no raw password stored
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function verifyLogin({ identifier, password }) {
  const saved = getSavedUser();
  if (!saved) return { ok: false, reason: "NO_PROFILE" };

  const id = identifier.trim();
  const okId = id === saved.email || id === saved.phone;
  if (!okId) return { ok: false, reason: "BAD_ID" };

  const salt = saved?.auth?.salt;
  const expectedHash = saved?.auth?.passwordHash;
  if (!salt || !expectedHash) return { ok: false, reason: "NO_AUTH" };

  const candidateHash = await sha256Hex(`${salt}:${password}`);
  if (candidateHash !== expectedHash) return { ok: false, reason: "BAD_PASSWORD" };

  return { ok: true, user: saved };
}