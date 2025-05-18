import React, { useEffect, useState } from 'react';
import './TheaterShows.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllTheaterShows } from '../../services/theaterservices';

// Import images from assets
import show1Poster from '../../assets/omar khairat.jpg';
import show2Poster from '../../assets/20century.jpg';
import show3Poster from '../../assets/russian national dance.jpg';
import show4Poster from '../../assets/بليغ و ورده.jpg';
import show5Poster from '../../assets/وهابيات.jpg';

// Static poster mapping with imported images
const STATIC_POSTERS = {
  'omar khairat': show1Poster,
  '20century': show2Poster,
  'russian national dance': show3Poster,
  'بليغ و ورده': show4Poster,
  'وهابيات': show5Poster
};

const DEFAULT_IMAGE = 'https://via.placeholder.com/180x260?text=No+Image';

const TheaterShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const navigate = useNavigate();
  const locationState = useLocation();
  const selectedLocation = locationState.state?.location || 'Choose a location';

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllTheaterShows();
        if (!data || !Array.isArray(data)) throw new Error('Invalid data format received from server');
        const processed = data.map((show) => {
          const poster = STATIC_POSTERS[show.title] || DEFAULT_IMAGE;
          return {
            ...show,
            poster,
            title: show.title || 'Untitled',
            capacity: show.capacity,
            amenities: show.amenities || [],
            showtimes: Array.isArray(show.showtimes) ? show.showtimes : [],
            isActive: show.isActive,
            createdAt: show.createdAt
          };
        });
        setShows(processed);
      } catch (err) {
        setError(err.message || 'Failed to fetch shows');
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const maxSlide = Math.max(0, Math.ceil(shows.length / 2) - 1);

  const handlePrev = () => {
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : maxSlide));
  };

  const handleNext = () => {
    setSlideIndex((prev) => (prev < maxSlide ? prev + 1 : 0));
  };

  const handleTimeSelect = (showId, time) => {
    setSelectedTime((prev) => (prev === time && selectedShowId === showId ? null : time));
    setSelectedShowId(showId);
  };

  const handleImageError = (e, showTitle) => {
    e.target.src = DEFAULT_IMAGE;
  };

  const handleBuyTicket = () => {
    // Remove navigation to /theater-seating
    // This feature is no longer supported
  };

  if (loading) return <div className="movies-loading">Loading shows...</div>;
  if (error) return <div className="movies-error">Error: {error}</div>;
  if (shows.length === 0) return <div className="movies-empty">No shows available</div>;

  const visibleShows = shows.slice(slideIndex * 2, slideIndex * 2 + 2);

  return (
    <div className="cinema-container">
      <h1 className="cinema-title">Theater Shows</h1>
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
          {visibleShows.map((show) => (
            <div className="movie-card" key={show._id}>
              <img
                src={show.poster}
                alt={show.title}
                className="movie-poster"
                onError={(e) => handleImageError(e, show.title)}
              />
              <div className="movie-title">{show.title}</div>
              <div className="showtimes-section">
                <div className="showtimes-label">Showtimes</div>
                <div className="showtimes-list">
                  {Array.isArray(show.showtimes) && show.showtimes.length > 0 ? (
                    show.showtimes.map((time, i) => (
                      <button
                        key={i}
                        className={`showtime-btn ${selectedTime === time && selectedShowId === show._id ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(show._id, time)}
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
                  disabled={!selectedTime || selectedShowId !== show._id}
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

export default TheaterShows;
