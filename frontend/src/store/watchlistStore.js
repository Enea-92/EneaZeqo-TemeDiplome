import { create } from "zustand";
import axios from "axios";

const API = "http://localhost:5000/api";

export const useWatchlistStore = create((set, get) => ({
  watchlist: [],
  isLoading: false,

  fetchWatchlist: async () => {
    try {
      set({ isLoading: true });

      const res = await axios.get(`${API}/watchlist`, {
        withCredentials: true,
      });

      set({
        watchlist: res.data.watchlist || [],
      });
    } catch (err) {
      console.log("fetchWatchlist error:", err?.response?.data || err);
      set({ watchlist: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addToWatchlist: async (movie) => {
    try {
      // ✅ FIX: Ensure movieId is always sent as a number
      const payload = {
        ...movie,
        movieId: Number(movie.movieId),
      };

      const res = await axios.post(
        `${API}/watchlist/add`,
        payload,
        { withCredentials: true }
      );

      set({
        watchlist: res.data.watchlist || [],
      });

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      console.log("addToWatchlist error:", err?.response?.data || err);

      return {
        success: false,
        message: err.response?.data?.message || "Error adding movie",
      };
    }
  },

  removeFromWatchlist: async (movieId) => {
    try {
      // ✅ FIX: Ensure movieId is a number before sending
      const numericMovieId = Number(movieId);

      const res = await axios.delete(
        `${API}/watchlist/${numericMovieId}`,
        { withCredentials: true }
      );

      // ✅ FIX: Normalize both sides when filtering local state
      set((state) => ({
        watchlist: state.watchlist.filter(
          (m) => Number(m.movieId) !== numericMovieId
        ),
      }));

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      console.log("remove error:", err?.response?.data || err);

      return {
        success: false,
        message: err.response?.data?.message || "Error removing movie",
      };
    }
  },

  /* =========================
     CHECK MOVIE
  ========================= */
  isInWatchlist: (movieId) => {
    // ✅ FIX: Normalize both sides to Number before comparing
    return get().watchlist?.some(
      (m) => Number(m.movieId) === Number(movieId)
    );
  },
}));