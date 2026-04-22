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
      if (!res.ok) throw new Error('Failed to fetch movie');
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

      const results = await Promise.all(
        movieTitles.map((title) => fetchMovie(title))
      );

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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              className="w-full h-64 object-cover"
              alt={movie.title}
            />
          ) : (
            <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
              <p className="text-gray-400">No Image</p>
            </div>
          )}

          <div className="p-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {movie.title}
            </h3>
            <p className="text-xs text-gray-400">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedMovies;