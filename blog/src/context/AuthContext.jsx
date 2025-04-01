import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import { handleAxiosError } from "../utilities/errorHandler";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {data} = await api.get("/user/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/user/login", { email, password }); 
      setUser(data.user); // Make sure this sets the complete user data, including `role`.
    } catch (error) {
      setAuthError(handleAxiosError(error));
    }
  };
  
  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
