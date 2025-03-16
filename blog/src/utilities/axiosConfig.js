import axios from "axios";
import { handleAxiosError } from "./errorHandler";

const api = axios.create({
  baseURL: "https://apostolicanswers.onrender.com" /*"http://localhost:5000"*/,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleAxiosError(error);
    return Promise.reject(errorMessage);
  }
);

export default api;
