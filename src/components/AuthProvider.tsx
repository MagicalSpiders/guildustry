"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { role: "candidate" | "employer" } | null;
  login: (role: "candidate" | "employer") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ role: "candidate" | "employer" } | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    const authData = localStorage.getItem("guildustry_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setIsAuthenticated(true);
        setUser({ role: parsed.role });
      } catch (e) {
        localStorage.removeItem("guildustry_auth");
      }
    }
  }, []);

  const login = (role: "candidate" | "employer") => {
    setIsAuthenticated(true);
    setUser({ role });
    localStorage.setItem("guildustry_auth", JSON.stringify({ role }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("guildustry_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

