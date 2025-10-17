import React, { useEffect, useState } from 'react';
import './TheaterShows.css';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getAllTheaterShows } from '../../services/theaterservices';
// import axios from 'axios';

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

const DUMMY_SHOWS = [
  {
    _id: '1',
    title: 'Omar Khairat',
    name: 'Cairo Opera House',
    location: 'Cairo',
    capacity: 500,
    screenType: 'IMAX',
    amenities: ['Premium Seating', 'Air Conditioning', 'Wheelchair Access'],
    showtimes: ['19:00', '21:00'],
    isActive: true,
    createdAt: '2023-01-01T18:00:00Z',
    poster: show1Poster
  },
  {
    _id: '2',
    title: '20century',
    name: 'Alexandria Opera House',
    location: 'Alexandria',
    capacity: 400,
    screenType: 'IMAX',
    amenities: ['Premium Seating', 'Air Conditioning', 'Wheelchair Access'],
    showtimes: ['18:00', '20:00'],
    isActive: true,
    createdAt: '2023-01-02T18:00:00Z',
    poster: show2Poster
  },
  {
    _id: '3',
    title: 'Russian National Dance',
    name: 'Cairo Opera House',
    location: 'Cairo',
    capacity: 300,
    screenType: 'IMAX',
    amenities: ['Premium Seating', 'Air Conditioning', 'Wheelchair Access'],
    showtimes: ['19:30', '21:30'],
    isActive: true,
    createdAt: '2023-01-03T18:00:00Z',
    poster: show3Poster
  },
  {
    _id: '4',
    title: 'بليغ و ورده',
    name: 'Alexandria Opera House',
    location: 'Alexandria',
    capacity: 350,
    screenType: 'IMAX',
    amenities: ['Premium Seating', 'Air Conditioning', 'Wheelchair Access'],
    showtimes: ['20:00', '22:00'],
    isActive: true,
    createdAt: '2023-01-04T18:00:00Z',
    poster: show4Poster
  },
  {
    _id: '5',
    title: 'وهابيات',
    name: 'Cairo Opera House',
    location: 'Cairo',
    capacity: 450,
    screenType: 'IMAX',
    amenities: ['Premium Seating', 'Air Conditioning', 'Wheelchair Access'],
    showtimes: ['18:30', '20:30'],
    isActive: true,
    createdAt: '2023-01-05T18:00:00Z',
    poster: show5Poster
  }
];

const TheaterShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const locationState = useLocation();
  const selectedLocation = locationState.state?.location || 'Choose a location';
  const navigate = useNavigate();

  useEffect(() => {
    // Use dummy data instead of fetching from MongoDB
    setShows(DUMMY_SHOWS);
    setLoading(false);
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

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  const handleBuyTicket = () => {
    if (selectedTime && selectedShowId) {
      const selectedShow = shows.find(show => show._id === selectedShowId);
      navigate('/TheaterSeating', {
        state: {
          show: selectedShow,
          selectedTime,
          location: selectedShow.location
        }
      });
    }
  };

  if (loading) return <div className="movies-loading">Loading shows...</div>;
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
                onError={handleImageError}
              />
              <div className="movie-title">{show.title}</div>
              <div><strong>Theater Name:</strong> {show.name}</div>
              <div><strong>Showtimes:</strong> {Array.isArray(show.showtimes) ? show.showtimes.join(', ') : ''}</div>
              <div><strong>Location:</strong> {show.location}</div>
              <div><strong>Capacity:</strong> {show.capacity}</div>
              <div><strong>Screen Type:</strong> {show.screenType}</div>
              <div className="showtimes-section">
                <div className="showtimes-label">Showtimes</div>
                <div className="showtimes-list">
                  {Array.isArray(show.showtimes) && show.showtimes.length > 0 ? (
                    show.showtimes.map((time, i) => (
                      <button
                        key={i}
                        className={`showtime-btn${selectedTime === time && selectedShowId === show._id ? ' selected' : ''}`}
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
            className={`slider-dot${idx === slideIndex ? ' active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default TheaterShows;