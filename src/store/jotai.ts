import { atom } from "jotai";

// OTP atom for email verification
const otpAtom = atom<string>("");

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin";
}

// Helper functions for localStorage persistence
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user-data");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("user-data", JSON.stringify(user));
  } else {
    localStorage.removeItem("user-data");
  }
};

// Simple auth atom to hold user data with persistence
const authAtom = atom<User | null>(getStoredUser());

// Write-only atom for updating user data
const updateUserAtom = atom(null, (_, set, newValue: User | null) => {
  set(authAtom, newValue);
  setStoredUser(newValue);
});

export { authAtom, otpAtom, updateUserAtom, type User };
