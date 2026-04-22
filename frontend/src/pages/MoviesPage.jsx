import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";

const categoryMeta = {
  top_rated: { label: "Top Rated Movies", emoji: "⭐" },
  popular: { label: "Popular Movies", emoji: "🔥" },
  upcoming: { label: "Upcoming Movies", emoji: "🎬" },
};

const MoviesPage = () => {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
   
  
  const meta = categoryMeta[category] || { label: "Movies", emoji: "🎬" };

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    setMovies([]);
    setPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.results || []);
        setTotalPages(Math.min(res.total_pages, 20));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [category, page]);

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header */}
      <div className="px-8 pt-10 pb-6 border-b border-[#2a2a2a]">
        <h1 className="text-4xl font-bold">
          <span className="mr-3">{meta.emoji}</span>
          {meta.label}
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Page {page} of {totalPages}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="px-8 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="group bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition duration-200 hover:shadow-xl hover:shadow-black/50"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
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
                  <span className="text-xs text-yellow-400 font-medium">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex items-center justify-center gap-4 pb-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 rounded-lg bg-[#232323] border border-[#333] text-white hover:bg-[#e50914] hover:border-[#e50914] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                page <= 3
                  ? i + 1
                  : page >= totalPages - 2
                  ? totalPages - 4 + i
                  : page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                    page === pageNum
                      ? "bg-[#e50914] text-white"
                      : "bg-[#232323] border border-[#333] text-white hover:bg-[#333]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 rounded-lg bg-[#232323] border border-[#333] text-white hover:bg-[#e50914] hover:border-[#e50914] transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MoviesPage;
