import React, { useEffect, useState } from 'react';
import './CinemaSeating.css';
import { useLocation, useNavigate } from 'react-router-dom';

const seatColors = {
  regular: 'regular-seat',
  vip: 'vip-seat',
  selected: 'selected-seat',
  unavailable: 'unavailable-seat',
};

const CinemaSeating = () => {
  const [seats, setSeats] = useState([]);
  const [prices, setPrices] = useState({ regular: 0, vip: 0 });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, showTime, movieName } = location.state || {};

  useEffect(() => {
    fetch('http://localhost:5002/api/seats/layout')
      .then(res => res.json())
      .then(data => {
        setSeats(data.seats);
        setPrices(data.prices);
        setLoading(false);
      });
  }, []);

  const handleSeatClick = (row, number, type, available) => {
    if (!available) return;
    const seatId = `${row}${number}`;
    setSelected(prev =>
      prev.some(s => s.id === seatId)
        ? prev.filter(s => s.id !== seatId)
        : [...prev, { id: seatId, row, number, type }]
    );
  };

  const getSeatClass = (row, number, type, available) => {
    const seatId = `${row}${number}`;
    if (!available) return seatColors.unavailable;
    if (selected.some(s => s.id === seatId)) return seatColors.selected;
    return seatColors[type];
  };

  const total = selected.reduce((sum, seat) => sum + prices[seat.type], 0);

  // Group seats by row for rendering
  const rows = seats.reduce((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="cinema-seating-outer">
      <div className="cinema-seating-container">
        <h2 className="select-seats-title">Select Seats</h2>
        <div className="movie-title">Movie: {movieName || movieId || 'N/A'}</div>
        <div className="showtime">Time: {showTime || 'N/A'}</div>
        <div className="screen-label">SCREEN</div>
        <div className="seats-area">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="seats-grid">
              {Object.keys(rows).map(row => (
                <div className="seat-row" key={row}>
                  <span className="row-label">{row}</span>
                  {rows[row].map(seat => (
                    <button
                      key={seat.number}
                      className={`seat-btn ${getSeatClass(seat.row, seat.number, seat.type, seat.available)}`}
                      onClick={() => handleSeatClick(seat.row, seat.number, seat.type, seat.available)}
                      disabled={!seat.available}
                    >
                      {seat.number}
                    </button>
                  ))}
                  <span className="row-label">{row}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="legend">
          <span className="legend-item regular-seat"></span> Regular Seat
          <span className="legend-item vip-seat"></span> VIP Seat
          <span className="legend-item selected-seat"></span> Selected
          <span className="legend-item unavailable-seat"></span> Unavailable
        </div>
        <div className="selection-summary">
          <div>
            {selected.length === 0 ? (
              <span>No seats selected</span>
            ) : (
              <span>
                {selected.map(s => `${s.row}${s.number}`).join(', ')}
              </span>
            )}
          </div>
          <div>Total: {total.toFixed(2)} EGP</div>
        </div>
        <div className="actions">
          <button className="back-btn" onClick={() => navigate('/movies')}>Back to Movies</button>
          <button className="cancel-btn">Cancel Booking</button>
          <button className="confirm-btn" disabled={selected.length === 0}>Confirm Selection</button>
        </div>
      </div>
    </div>
  );
};

export default CinemaSeating;
