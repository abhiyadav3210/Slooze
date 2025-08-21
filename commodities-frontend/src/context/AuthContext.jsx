import { createContext, useContext, useState, useEffect, useRef } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initializingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initialized || initializingRef.current) return;

    const initAuth = async () => {
      initializingRef.current = true;

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Clean up invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
        initializingRef.current = false;
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading: loading || !initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
