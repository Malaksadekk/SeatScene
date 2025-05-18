import React, { useEffect, useState } from 'react';
import './CinemaMovies.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllMovies } from '../../services/movieservices';

// Import images from assets
import alHanaPoster from '../../assets/Al-Hana Elli Ana Fih.jpg';
import sikoSikoPoster from '../../assets/siko siko.jpg';
import flight404Poster from '../../assets/Flight 404.jpg';
import untilDawnPoster from '../../assets/until dawn.png';
import thunderboltsPoster from '../../assets/thunderbolts.png';
import accountant2Poster from '../../assets/The Accountant 2.png';
// Static poster mapping with imported images
const STATIC_POSTERS = {
  'Al-Hana Elli Ana Fih': alHanaPoster,
  'Siko Siko': sikoSikoPoster,
  'Flight 404': flight404Poster,
  'Until Dawn': untilDawnPoster,
  'Thunderbolts': thunderboltsPoster,
  'The Accountant 2': accountant2Poster
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/180x260?text=No+Image';

const CinemaMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();
  const locationState = useLocation();
  const selectedLocation = locationState.state?.location || 'Choose a location';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Starting to fetch movies...');
        setLoading(true);
        setError(null);
        
        const data = await getAllMovies();
        console.log('Raw movie data received:', data);

        if (!data || !Array.isArray(data)) {
          console.error('Invalid data received:', data);
          throw new Error('Invalid data format received from server');
        }

        // Log all movie titles from server
        console.log('Movie titles from server:', data.map(m => m.title));
        // Log all available static poster titles
        console.log('Available static poster titles:', Object.keys(STATIC_POSTERS));

        const processed = data.map((movie) => {
          // Special logging for The Accountant 2
          if (movie.title.includes('Accountant')) {
            console.log('Found Accountant movie:', {
              serverTitle: movie.title,
              exactMatch: STATIC_POSTERS[movie.title] !== undefined,
              availablePosters: Object.keys(STATIC_POSTERS)
            });
          }

          const poster = STATIC_POSTERS[movie.title] || movie.posterUrl || DEFAULT_IMAGE;
          
          return {
          ...movie,
            poster,
            title: movie.title || 'Untitled',
            description: movie.description || '',
            duration: movie.formattedDuration || `${movie.duration || 0} min`,
            genre: movie.genre || 'Unknown',
            releaseDate: movie.formattedReleaseDate || (movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'Unknown'),
            screenType: movie.screenType || 'Standard',
            amenities: Array.isArray(movie.amenities) ? movie.amenities : [],
            showtimes: Array.isArray(movie.showtimes) ? movie.showtimes : []
          };
        });

        console.log('Processed movies with posters:', processed.map(m => ({ 
          title: m.title, 
          poster: m.poster,
          hasStaticPoster: STATIC_POSTERS[m.title] !== undefined 
        })));
        setMovies(processed);
      } catch (err) {
        console.error('Error in fetchMovies:', err);
        setError(err.message || 'Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('Current state:', {
      loading,
      error,
      moviesCount: movies.length,
      slideIndex,
      selectedTime,
      selectedMovieId
    });
  }, [loading, error, movies, slideIndex, selectedTime, selectedMovieId]);

  const maxSlide = Math.max(0, Math.ceil(movies.length / 2) - 1);

  const handlePrev = () => {
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : maxSlide));
  };

  const handleNext = () => {
    setSlideIndex((prev) => (prev < maxSlide ? prev + 1 : 0));
  };

  const handleTimeSelect = (movieId, time) => {
    setSelectedTime((prev) => (prev === time && selectedMovieId === movieId ? null : time));
    setSelectedMovieId(movieId);
  };

  const handleImageError = (e, movieTitle) => {
    console.error(`Failed to load image for ${movieTitle}:`, {
      attemptedUrl: e.target.src,
      movieTitle,
      availableStaticPosters: Object.keys(STATIC_POSTERS)
    });
    e.target.src = DEFAULT_IMAGE;
  };

  const handleBuyTicket = () => {
    if (selectedMovieId && selectedTime) {
      const selectedMovie = movies.find(m => m._id === selectedMovieId);
      // Debug log for movieId and movie object
      console.log('handleBuyTicket: selectedMovieId:', selectedMovieId, 'selectedMovie:', selectedMovie);
      // Warn if movieId is not a valid ObjectId
      if (!selectedMovieId || typeof selectedMovieId !== 'string' || selectedMovieId.length !== 24) {
        console.warn('movieId is not a valid MongoDB ObjectId:', selectedMovieId);
      }
      navigate('/seating', { 
        state: { 
          movieId: selectedMovieId, 
          showTime: selectedTime,
          movieName: selectedMovie?.title
        } 
      });
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return <div className="movies-loading">Loading movies...</div>;
  }
  
  if (error) {
    console.log('Rendering error state:', error);
    return <div className="movies-error">Error: {error}</div>;
  }
  
  if (movies.length === 0) {
    console.log('Rendering empty state');
    return <div className="movies-empty">No movies available</div>;
  }

  console.log('Rendering movies:', movies);
  const visibleMovies = movies.slice(slideIndex * 2, slideIndex * 2 + 2);
  console.log('Visible movies:', visibleMovies);

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">Cinema</h1>
      <div className="cinema-location">{selectedLocation}</div>
      <div className="slider-controls">
        <button 
          className="slider-arrow" 
          onClick={handlePrev}
          disabled={slideIndex === 0}
        >
          {'<'}
        </button>
        <div className="movie-carousel">
          {visibleMovies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
                onError={(e) => handleImageError(e, movie.title)}
              />
              <div className="movie-title">{movie.title}</div>
              <div className="movie-info">
                <div className="movie-genre">{movie.genre}</div>
                <div className="movie-duration">{movie.duration}</div>
                <div className="movie-screen-type">{movie.screenType}</div>
              </div>
              <div className="showtimes-section">
                <div className="showtimes-label">Showtimes</div>
                <div className="showtimes-list">
                  {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 ? (
                    movie.showtimes.map((time, i) => (
                      <button
                        key={i}
                        className={`showtime-btn ${selectedTime === time && selectedMovieId === movie._id ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(movie._id, time)}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <span className="no-showtimes">No showtimes available</span>
                  )}
                </div>
                <button
                  className="buy-ticket-btn"
                  disabled={!selectedTime || selectedMovieId !== movie._id}
                  onClick={handleBuyTicket}
                >
                  Buy ticket
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="slider-arrow" 
          onClick={handleNext}
          disabled={slideIndex === maxSlide}
        >
          {'>'}
        </button>
      </div>
      <div className="slider-dots">
        {Array.from({ length: maxSlide + 1 }).map((_, idx) => (
          <span
            key={idx}
            className={`slider-dot ${idx === slideIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CinemaMovies;