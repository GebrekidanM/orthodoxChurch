import React from "react"
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return <button className="font-bold cursor-pointer text-red-500 border border-red-500 py-1 px-3 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200  " onClick={logout}>ይውጡ</button>;
};

export default LogoutButton;
