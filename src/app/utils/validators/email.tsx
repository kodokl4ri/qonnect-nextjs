export const validateEmail = (email: string): string | null => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (/\s/.test(username)) return "Username cannot contain spaces";
  if (username.length < 6) return "Username must be at least 6 characters";
  return null;
};
