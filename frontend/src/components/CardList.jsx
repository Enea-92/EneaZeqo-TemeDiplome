import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

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

    fetch(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
      options
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movies');
        return res.json();
      })
      .then((res) => {
        setData(res.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
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
      <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>

      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
        {data.map((item) => (
          <SwiperSlide key={item.id} className="max-w-72">
            <Link to={`/movie/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                alt={item.original_title}
                className="h-44 w-full object-center object-cover rounded"
              />
              <p className="text-center pt-2">{item.original_title}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;