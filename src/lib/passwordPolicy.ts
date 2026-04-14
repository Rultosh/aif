export const STRONG_PASSWORD_HELPER_TEXT =
  "Use 8-64 characters with uppercase, lowercase, number, and special character.";

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,64}$/;

export function isStrongPassword(value: string | undefined | null): boolean {
  if (!value) return false;
  return STRONG_PASSWORD_REGEX.test(value);
}
