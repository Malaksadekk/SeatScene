import React, { useEffect, useState } from 'react';
import './CinemaMovies.css';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://via.placeholder.com/180x260?text=No+Image';

const CinemaMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/movies')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movies');
        return res.json();
      })
      .then((data) => {
        const processed = data.map((movie) => ({
          ...movie,
          poster: movie.posterUrl || DEFAULT_IMAGE,
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          genre: movie.genre,
          releaseDate: movie.releaseDate,
          screenType: movie.screenType,
          amenities: movie.amenities || [],
          showtimes: movie.showtimes || []
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
      const selectedMovie = movies.find(m => m._id === selectedMovieId);
      navigate('/seating', { 
        state: { 
          movieId: selectedMovieId, 
          showTime: selectedTime,
          movieName: selectedMovie.title
        } 
      });
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
                <div className="movie-duration">{movie.duration} min</div>
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
                    <span className="no-showtimes">No showtimes</span>
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