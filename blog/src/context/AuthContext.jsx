import React from 'react'
import { createContext, useContext, useEffect, useState } from "react";
import api from "../utilities/axiosConfig";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({children} ) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get("user/me");
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("user/login", { email, password });
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("user/logout");
    setUser(null);
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
