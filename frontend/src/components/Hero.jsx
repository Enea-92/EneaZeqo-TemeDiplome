import React, { useEffect, useState } from 'react'
import { Bookmark, Play } from 'lucide-react'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTRiZjVjYmJkY2NmNDEwZjFlNmI1MzY4MzJkNjQ4NyIsIm5iZiI6MTc3NDg2NzI5OC44MzUsInN1YiI6IjY5Y2E1MzYyNTcwOTI3MDZjMjYzNzFkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xRezJ-PG3Y5Ro6fOw99QkFZtKY4B8VNLnKvDouB1zqk'
  }
};

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch('https://api.themoviedb.org/3/movie/upcoming', options);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const selected = data.results[randomIndex];
          setMovie(selected);

          const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${selected.id}/videos?language=en-US`,
            options
          );
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
      <div className='flex items-center justify-center h-[480px] bg-gray-900 rounded-2xl' data-testid="hero-loading">
        <p className='text-white text-lg'>Loading...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className='flex items-center justify-center h-[480px] bg-gray-900 rounded-2xl' data-testid="hero-error">
        <p className='text-white text-lg'>{error || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <div className='text-white relative' data-testid="hero-container">
      <img
        src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
        alt={movie.title || 'Movie backdrop'}
        className='w-full rounded-2xl h-[480px] object-center object-cover'
        data-testid="hero-image"
      />

      {/* Movie Info Overlay */}
      <div className='absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl'>
        <h2 className='text-2xl md:text-4xl font-bold mb-2' data-testid="hero-title">{movie.title}</h2>
        <p className='text-sm md:text-base text-gray-300 mb-4 line-clamp-2 max-w-2xl' data-testid="hero-overview">
          {movie.overview}
        </p>
        
        <div className='flex space-x-2 md:space-x-4 font-medium'>
          <button 
            className='flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition-colors'
            data-testid="save-button"
          >
            <Bookmark className='mr-2 w-4 h-5 md:w-5 md:h-5' />
            Save for Later
          </button>

          <button 
            className='flex justify-center items-center bg-[#e50914] hover:bg-[#b8070f] text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition-colors'
            data-testid="watch-button"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank')}
          >
            <Play className='mr-2 w-4 h-5 md:w-5 md:h-5' />
            Watch Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero