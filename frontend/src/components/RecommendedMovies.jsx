import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecommendedMovies = ({ movieTitles }) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch movie");
      const data = await res.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error("Error fetching movie: ", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = await Promise.all(movieTitles.map((title) => fetchMovie(title)));
      setMovies(results.filter(Boolean));
      setLoading(false);
    };

    if (movieTitles?.length) {
      loadMovies();
    }
  }, [movieTitles]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-white text-lg">Loading recommendations...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No movies found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="group bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition duration-200 hover:shadow-xl hover:shadow-black/50"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              className="w-full h-64 object-cover"
              alt={movie.title}
            />
          ) : (
            <div className="w-full h-64 bg-[#2a2a2a] flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          <div className="p-3">
            <h3 className="text-sm font-semibold truncate group-hover:text-[#e50914] transition">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">
                {movie.release_date?.slice(0, 4) || "N/A"}
              </span>
              {movie.vote_average > 0 && (
                <span className="text-xs text-yellow-400 font-medium">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedMovies;