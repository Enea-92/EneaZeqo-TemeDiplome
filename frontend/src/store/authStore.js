import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});


export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  /* ---------- SIGNUP ---------- */
  signup: async (username, email, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const res = await api.post("/signup", {
        username,
        email,
        password,
      });

      set({
        user: res.data.user,
        isLoading: false,
      });

      return { success: true, user: res.data.user };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Signup error",
      });

      return {
        success: false,
        message: err.response?.data?.message,
      };
    }
  },

  /* ---------- LOGIN ---------- */
  login: async (username, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const res = await api.post("/login", {
        username,
        password,
      });

      set({
        user: res.data.user,
        message: res.data.message,
        isLoading: false,
      });

      return { success: true, user: res.data.user, message: res.data.message };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Login error",
      });

      return {
        success: false,
        message: err.response?.data?.message || "Login error",
      };
    }
  },

  /* ---------- FETCH USER ---------- */
  fetchUser: async () => {
    set({ fetchingUser: true });

    try {
      const res = await api.get("/fetch-user");

      set({
        user: res.data.user,
        fetchingUser: false,
      });
    } catch (err) {
      set({
        user: null,
        fetchingUser: false,
      });
    }
  },

  /* ---------- LOGOUT ---------- */
  logout: async () => {
    set({ isLoading: true });

    try {
      const res = await api.post("/logout");

      set({
        user: null,
        message: res.data.message,
        isLoading: false,
      });

      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Logout error",
      });

      return { success: false, message: "Logout error" };
    }
  },
}));