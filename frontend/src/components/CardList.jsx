import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 1000));
      } else {
        throw err;
      }
    }
  }
};

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchWithRetry(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
      options
    )
      .then((res) => {
        setData(res.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load. Please refresh.");
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="text-white md:px-4">
        <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white md:px-4">
        <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="text-white md:px-4">
      <Link to={`/movies/${category}`}>
        <h2 className="pt-10 pb-5 text-lg font-medium hover:text-[#e50914] transition cursor-pointer inline-block">
          {title} <span className="text-sm text-gray-400 hover:text-[#e50914]">→</span>
        </h2>
      </Link>

      <Swiper slidesPerView={"auto"} spaceBetween={12} className="mySwiper">
        {data.map((item) => (
          <SwiperSlide key={item.id} style={{ width: "160px" }}>
            <Link
              to={`/movie/${item.id}`}
              className="group block bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition duration-200 hover:shadow-xl hover:shadow-black/50"
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.original_title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-[#2a2a2a] flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate text-white group-hover:text-[#e50914] transition">
                  {item.original_title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-300 font-medium">
                    {item.release_date?.slice(0, 4) || "N/A"}
                  </span>
                  {item.vote_average > 0 && (
                    <span className="text-xs text-yellow-400 font-semibold">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;