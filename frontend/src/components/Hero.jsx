import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch('https://api.themoviedb.org/3/movie/upcoming', options);
        if (!res.ok) throw new Error('Failed to fetch movies');

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const selected = data.results[randomIndex];
          setMovie(selected);

          const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${selected.id}/videos?language=en-US`,
            options
          );
          if (!videoRes.ok) throw new Error('Failed to fetch trailer');

          const videoData = await videoRes.json();
          const trailer = videoData.results?.find(
            (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
          );
          setTrailerKey(trailer?.key || null);
        } else {
          setError('No movies found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-900 rounded-2xl">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-900 rounded-2xl">
        <p className="text-white text-lg">{error || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <div className="text-white relative">
      <img
        src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
        alt={movie.title}
        className="w-full rounded-2xl h-[480px] object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl">

        {/* Rating */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-yellow-400 font-semibold text-sm">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm">{movie.release_date?.slice(0, 4)}</span>
        </div>

        {/* Title — clickable */}
        <Link to={`/movie/${movie.id}`}>
          <h2 className="text-2xl md:text-4xl font-bold mb-2 hover:text-[#e50914] transition cursor-pointer">
            {movie.title}
          </h2>
        </Link>

        <p className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2 max-w-2xl">
          {movie.overview}
        </p>

        <div className="flex gap-3">
          <button
            className="flex items-center bg-[#e50914] hover:bg-[#b8070f] text-white py-3 px-6 rounded-full text-sm md:text-base transition disabled:opacity-50"
            disabled={!trailerKey}
            onClick={() =>
              trailerKey &&
              window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank')
            }
          >
            <Play className="mr-2 w-5 h-5" />
            {trailerKey ? 'Watch Trailer' : 'No Trailer'}
          </button>

          <Link to={`/movie/${movie.id}`}>
            <button className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-6 rounded-full text-sm md:text-base transition">
              More Info
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;