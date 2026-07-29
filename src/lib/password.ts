import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Minimum production-safe password policy. Intentionally simple (length +
 * character variety) rather than a "score" heuristic that could reject
 * reasonable passphrases.
 */
export function isPasswordStrongEnough(password: string): boolean {
  if (password.length < 12) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password);
  return hasLetter && hasNumberOrSymbol;
}
