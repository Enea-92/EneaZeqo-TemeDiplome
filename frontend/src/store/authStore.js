import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://eneazeqo-temediplome.onrender.com/api",
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  // initial states
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  // functions

  signup: async (username, email, password) => {
    set({ isLoading: true, message: null, error: null });

    try {
      const response = await api.post("/signup", {
        username,
        email,
        password,
      });

      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error signing up",
      });

      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, message: null, error: null });

    try {
      const response = await api.post("/login", {
        username,
        password,
      });

      const { user, message } = response.data;

      set({
        user,
        message,
        isLoading: false,
      });

      return { user, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging in",
      });

      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });

    try {
      const response = await api.get("/fetch-user");
      set({ user: response.data.user, fetchingUser: false });
    } catch (error) {
      set({
        fetchingUser: false,
        user: null,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await api.post("/logout");
      const { message } = response.data;
      set({
        message,
        isLoading: false,
        user: null,
        error: null,
      });

      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error logging out",
      });

      throw error;
    }
  },
}));