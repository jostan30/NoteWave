import { useMemo } from "react";
import {jwtDecode }from "jwt-decode";

interface DecodedToken {
  exp: number;
  name: string;
  email: string;
  dob: string;
}

export function useAuth() {
  const token = localStorage.getItem("token");

  return useMemo(() => {
    if (!token) return { isLoggedIn: false, user: null };

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token"); // cleanup expired
        return { isLoggedIn: false, user: null };
      }

      return { isLoggedIn: true, user: decoded };
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      return { isLoggedIn: false, user: null };
    }
  }, [token]);
}
