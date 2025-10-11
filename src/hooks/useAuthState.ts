import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { authClient } from "../lib/auth-client";
import { authAtom, updateUserAtom, type User } from "../store/jotai";

// Global flag to prevent multiple initializations
let globalInitializing = false;

export function useAuthState() {
  const [user] = useAtom(authAtom);
  const [, setUser] = useAtom(updateUserAtom);
  const isInitializing = useRef(false);

  // Helper functions
  const login = (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
      localStorage.setItem("auth-token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    authClient.signOut();
  };

  // Initialize auth state from localStorage and validate with server
  const initializeAuth = useCallback(async () => {
    // Prevent multiple simultaneous initializations globally
    if (globalInitializing || isInitializing.current) {
      return;
    }

    const storedToken = localStorage.getItem("auth-token");

    if (storedToken) {
      globalInitializing = true;
      isInitializing.current = true;
      try {
        const session = await authClient.getSession();
        console.log("getSession response:", session);

        if (session?.data?.user) {
          const userData = session.data.user;
          console.log("Setting user data:", userData);
          const userToStore = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            emailVerified: userData.emailVerified,
            image: userData.image || "",
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
            role: "user",
          } as User;
          setUser(userToStore);
          console.log("User set successfully");
        } else {
          console.log("No user data in session, clearing auth");
          localStorage.removeItem("auth-token");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("auth-token");
        setUser(null);
      } finally {
        globalInitializing = false;
        isInitializing.current = false;
      }
    }
    // If no token, clear user data
    else if (!storedToken && user) {
      setUser(null);
    }
  }, [setUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Force refresh auth data from server
  const refreshAuth = useCallback(async () => {
    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const userData = session.data.user;
          const userToStore = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            emailVerified: userData.emailVerified,
            image: userData.image || "",
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
            role: "user",
          } as User;
          setUser(userToStore);
        }
      } catch (error) {
        console.error("Auth refresh failed:", error);
      }
    }
  }, [setUser]);

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    initializeAuth,
    refreshAuth,
  };
}
