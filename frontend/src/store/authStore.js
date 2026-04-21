import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://eneazeqo-temediplome.onrender.com/api",
  withCredentials: true,
});

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,
  watchlist: [],

  signup: async (username, email, password) => {
    set({ isLoading: true, message: null, error: null });
    try {
      const response = await api.post("/signup", { username, email, password });
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error signing up" });
      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, message: null, error: null });
    try {
      const response = await api.post("/login", { username, password });
      const { user, message } = response.data;
      set({ user, message, isLoading: false });
      return { user, message };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error logging in" });
      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });
    try {
      const response = await api.get("/fetch-user");
      set({ user: response.data.user, fetchingUser: false });
    } catch (error) {
      set({ fetchingUser: false, user: null });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await api.post("/logout");
      const { message } = response.data;
      set({ message, isLoading: false, user: null, error: null, watchlist: [] });
      return { message };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error logging out" });
      throw error;
    }
  },

  fetchWatchlist: async () => {
    try {
      const response = await api.get("/watchlist");
      set({ watchlist: response.data.watchlist });
    } catch (error) {
      set({ watchlist: [] });
    }
  },

  addToWatchlist: async (movieId, title, poster_path) => {
    try {
      const response = await api.post("/watchlist/add", { movieId, title, poster_path });
      set({ watchlist: response.data.watchlist });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error adding to watchlist" };
    }
  },

  removeFromWatchlist: async (movieId) => {
    try {
      const response = await api.post("/watchlist/remove", { movieId });
      set({ watchlist: response.data.watchlist });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error removing from watchlist" };
    }
  },
}));