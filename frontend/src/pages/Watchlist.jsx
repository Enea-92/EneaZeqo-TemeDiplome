import React, { useEffect } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Trash2 } from "lucide-react";

const Watchlist = () => {
  const { watchlist, fetchWatchlist, removeFromWatchlist, user } = useAuthStore();

  useEffect(() => {
    if (user) fetchWatchlist();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#181818]">
        <p className="text-white text-xl">
          <Link to="/signin" className="text-[#e50914] underline">Sign in</Link> to see your watchlist.
        </p>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#181818]">
        <p className="text-white text-xl">Your watchlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {watchlist.map((movie) => (
          <div key={movie.movieId} className="bg-[#232323] rounded-lg overflow-hidden relative group">
            <Link to={`/movie/${movie.movieId}`}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
              </div>
            </Link>
            <button
              onClick={() => removeFromWatchlist(movie.movieId)}
              className="absolute top-2 right-2 bg-[#e50914] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;