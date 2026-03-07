function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}


// Generate random salt string
export function generateSalt(length = 16) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    salt += characters[index];
  }
  return salt;
}


// Hash password using SHA-256
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}
// Create local demo user
export async function createLocalUser(userData) {
  const salt = generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);
  const safeUser = {
    fullName: userData.fullName,
    email: userData.email,
    salt,
    passwordHash
  };

  localStorage.setItem(
    "dietify_registered_user",
    JSON.stringify(safeUser)
  );
  return safeUser;
}
// Validate login
export async function validateLocalLogin(email, password) {
  const stored = localStorage.getItem("dietify_registered_user");
  if (!stored) return null;
  const savedUser = JSON.parse(stored);
  if (savedUser.email !== email) return null;
  const attemptedHash =
    await hashPassword(password, savedUser.salt);
  if (attemptedHash !== savedUser.passwordHash) {
    return null;
  }
  return {
    fullName: savedUser.fullName,
    email: savedUser.email
  };
}