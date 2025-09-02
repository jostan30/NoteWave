import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  name: string;
  email: string;
  dob: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: DecodedToken | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const authValue = React.useMemo(() => {
    if (!token) return { isLoggedIn: false, user: null, token: null, login, logout };

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        setToken(null);
        return { isLoggedIn: false, user: null, token: null, login, logout };
      }

      return { isLoggedIn: true, user: decoded, token, login, logout };
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setToken(null);
      return { isLoggedIn: false, user: null, token: null, login, logout };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}