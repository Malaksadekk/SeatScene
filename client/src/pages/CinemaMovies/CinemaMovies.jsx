import React, { useEffect, useState } from 'react';
import './CinemaMovies.css';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://via.placeholder.com/180x260?text=No+Image';

const CinemaMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null); // Track only one selected time globally
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movies');
        return res.json();
      })
      .then((data) => {
        const processed = data.map((movie, idx) => ({
          ...movie,
          poster: movie.poster || movie.posterUrl || movie.image || DEFAULT_IMAGE,
          title: movie.title || `Movie ${idx + 1}`,
        }));
        setMovies(processed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    console.warn(`Failed to load image for ${movieTitle}: ${e.target.src}`);
    e.target.src = DEFAULT_IMAGE;
  };

  const handleBuyTicket = () => {
    if (selectedMovieId && selectedTime) {
      navigate('/seating', { state: { movieId: selectedMovieId, showTime: selectedTime } });
    }
  };

  if (loading) return <div className="movies-loading">Loading...</div>;
  if (error) return <div className="movies-error">{error}</div>;

  const visibleMovies = movies.slice(slideIndex * 2, slideIndex * 2 + 2);

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">Cinema</h1>
      <div className="cinema-subtitle">مدينة قصر</div>
      <div className="slider-controls">
        <button className="slider-arrow" onClick={handlePrev}>{'<'}</button>
        <div className="movie-carousel">
          {visibleMovies.map((movie) => {
            const movieId = movie._id || movie.id;
            return (
              <div className="movie-card" key={movieId}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => handleImageError(e, movie.title)}
                />
                <div className="movie-title">{movie.title}</div>
                <div className="showtimes-section">
                  <div className="showtimes-label">Showtimes</div>
                  <div className="showtimes-list">
                    {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 ? (
                      movie.showtimes.map((time, i) => (
                        <button
                          key={i}
                          className={`showtime-btn ${selectedTime === time && selectedMovieId === movieId ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(movieId, time)}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <span className="no-showtimes">No showtimes</span>
                    )}
                  </div>
                  <button
                    className="buy-ticket-btn"
                    disabled={!selectedTime || selectedMovieId !== movieId}
                    onClick={handleBuyTicket}
                  >
                    Buy ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="slider-arrow" onClick={handleNext}>{'>'}</button>
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