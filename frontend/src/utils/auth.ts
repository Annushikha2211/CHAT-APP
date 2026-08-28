import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  exp?: number;
}

export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    return decoded.userId;
  } catch {
    return null;
  }
};