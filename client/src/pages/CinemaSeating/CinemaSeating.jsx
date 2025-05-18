import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CinemaSeating.css';

function CinemaSeating() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [showtime, setShowtime] = useState('');
  const [seats, setSeats] = useState([]);
  const [prices, setPrices] = useState({ regular: 0, vip: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { movieName, showTime, movieId } = location.state || {};
    // Debug log for movieId and location.state
    console.log('CinemaSeating: location.state:', location.state, 'movieId:', movieId);
    if (!movieId) {
      setError('No movie selected');
      setLoading(false);
      return;
    }
    if (movieName) setMovieTitle(movieName);
    if (showTime) setShowtime(showTime);

    // Fetch seat layout
    fetch(`/api/seats/layout?movieId=${movieId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch seat layout');
        return res.json();
      })
      .then(data => {
        setSeats(data.seats);
        setPrices(data.prices);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching seats:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [location.state]);

  const toggleSeatSelection = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => `${s.row}${s.number}` === seatId);
      const price = seat?.type === 'vip' ? prices.vip : prices.regular;
      return total + price;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  const formatPrice = (price) => {
    return `${price.toFixed(2)} EGP`;
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) return;
    const { movieId, showTime, movieName } = location.state || {};
    navigate('/payment', { 
      state: { 
        movieId, 
        showTime, 
        movieName,
        seats: selectedSeats, 
        totalPrice 
      } 
    });
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel your booking?')) {
      navigate('/movies');
    }
  };

  const renderSeats = () => {
    if (!seats || seats.length === 0) {
      return <div className="no-seats-message">No seats available for this movie/showtime.</div>;
    }

    const seatsByRow = seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});

    const sortedRows = Object.keys(seatsByRow).sort();

    return sortedRows.map(row => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        {seatsByRow[row].map(seat => {
          const seatId = `${seat.row}${seat.number}`;
          const isSelected = selectedSeats.includes(seatId);
          return (
            <div
              key={seatId}
              className={`seat ${!seat.available ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${seat.type === 'vip' ? 'vip' : ''}`}
              onClick={() => seat.available && toggleSeatSelection(seatId)}
            >
              {seat.number}
            </div>
          );
        })}
        <div className="row-label">{row}</div>
      </div>
    ));
  };

  if (loading) return <div className="loading-message">Loading seats...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="seating-container">
      <h1 className="seating-title">Select Seats</h1>
      <div className="movie-details">
        <p className="movie-info">{movieTitle}</p>
        <p className="showtime-info">Time: {showtime}</p>
      </div>
      <div className="screen-container">
        <div className="screen">SCREEN</div>
      </div>
      <div className="seating-chart">{renderSeats()}</div>
      <div className="seat-legend">
        <div className="legend-item"><div className="seat available"></div><span>Regular Seat</span></div>
        <div className="legend-item"><div className="seat vip"></div><span>VIP Seat</span></div>
        <div className="legend-item"><div className="seat selected"></div><span>Selected</span></div>
        <div className="legend-item"><div className="seat unavailable"></div><span>Unavailable</span></div>
      </div>
      <div className="selection-summary">
        <p>{selectedSeats.length > 0 ? `Selected seats: ${selectedSeats.sort().join(', ')}` : 'No seats selected'}</p>
        <p className="price-summary">Total: {formatPrice(totalPrice)}</p>
      </div>
      <div className="action-buttons">
        <button className="back-button" onClick={() => navigate(-1)}>Back to Movies</button>
        <button className="cancel-button" onClick={handleCancelBooking}>Cancel Booking</button>
        <button 
          className="confirm-button" 
          disabled={selectedSeats.length === 0} 
          onClick={handleConfirmSelection}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}

export default CinemaSeating;