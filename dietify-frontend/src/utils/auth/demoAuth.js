// src/utils/auth/demoAuth.js
// Demo auth using localStorage.
// NOTE: For production, replace this with backend auth.

const USERS_KEY = "dietify_demo_users";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizePhone = (phone) => String(phone || "").trim(); // should already be +E164
const normalizeIdentifier = (id) => {
  const v = String(id || "").trim();
  // if it looks like email -> normalize email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return normalizeEmail(v);
  // else treat as phone (expects +491234...)
  return normalizePhone(v);
};

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// ✅ matches your Registration.jsx usage
export async function registerUser(payload = {}) {
  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const gender = String(payload.gender || "").trim();
  const password = String(payload.password || "");

  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");

  const users = readUsers();

  // avoid duplicates by email OR phone
  const exists = users.some(
    (u) =>
      (u.email && normalizeEmail(u.email) === email) ||
      (phone && u.phone && normalizePhone(u.phone) === phone)
  );

  if (exists) {
    // Keep it simple; your UI shows generic error anyway
    throw new Error("User already exists");
  }

  users.push({
    id: crypto?.randomUUID?.() || String(Date.now()),
    firstName,
    lastName,
    email,
    phone,   // store +E164
    gender,
    // demo only: store password (if you are hashing in your version, keep hashing,
    // but then verifyLogin must compare accordingly)
    password,
    createdAt: new Date().toISOString(),
  });

  writeUsers(users);
  return { ok: true };
}

// ✅ matches your Registration.jsx usage
export async function verifyLogin({ identifier, password } = {}) {
  const id = normalizeIdentifier(identifier);
  const pw = String(password || "");

  if (!id || !pw) return { ok: false, reason: "INVALID_INPUT" };

  const users = readUsers();

  const found = users.find((u) => {
    const emailMatch = u.email && normalizeEmail(u.email) === id;
    const phoneMatch = u.phone && normalizePhone(u.phone) === id;
    return (emailMatch || phoneMatch) && String(u.password) === pw;
  });

  if (!found) {
    // If identifier exists but password wrong, we still treat as incorrect credentials
    const profileExists = users.some((u) => {
      const emailMatch = u.email && normalizeEmail(u.email) === id;
      const phoneMatch = u.phone && normalizePhone(u.phone) === id;
      return emailMatch || phoneMatch;
    });

    if (!profileExists) return { ok: false, reason: "NO_PROFILE" };
    return { ok: false, reason: "BAD_CREDENTIALS" };
  }

  // optional: store current user (demo)
  localStorage.setItem("dietify_demo_current_user", found.id);

  return { ok: true, userId: found.id };
}