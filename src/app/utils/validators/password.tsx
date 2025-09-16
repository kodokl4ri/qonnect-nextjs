export const validatePassword = (
  password: string,
  username?: string,
  passwordConfirm?: string
): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters";
  //   if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  //   if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  //   if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
  if (/\s/.test(password)) return "Password cannot contain spaces";

  const blacklist = ["password123", "12345678", "qwerty123"];
  if (blacklist.includes(password.toLowerCase()))
    return "Password is too common";

  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    return "Password cannot contain your username";
  }
  if (passwordConfirm !== undefined && password !== passwordConfirm) {
    return "Passwords do not match";
  }

  return null; // ✅ valid
};
