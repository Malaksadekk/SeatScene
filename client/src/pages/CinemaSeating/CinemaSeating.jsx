import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CinemaSeating.css';

const CinemaSeating = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, selectedTime, location: cinemaLocation } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate seat data
    const fetchSeats = () => {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // 8 rows labeled A to H
      const seatsPerRow = 12; // 12 seats per row
      const seatData = [];

      rows.forEach((rowLabel, rowIndex) => {
        for (let number = 1; number <= seatsPerRow; number++) {
          if (number === 6 || number === 7) continue; // Central aisle

          let type = 'standard';
          let price = 10;
          if (rowIndex <= 1) { // Rows A and B are VIP
            type = 'vip';
            price = 20;
          } else if (rowIndex <= 3) { // Rows C and D are Premium
            type = 'premium';
            price = 15;
          }
          // Wheelchair-accessible seats in the last row (H)
          if (rowLabel === 'H' && (number === 1 || number === seatsPerRow)) {
            type = 'accessible';
            price = 8;
          }

          // Realistic booked pattern: more seats booked in the middle rows
          const isBooked = Math.random() > (rowIndex < 2 || rowIndex > rows.length - 3 ? 0.7 : 0.5);

          seatData.push({
            id: `${rowLabel}-${number}`,
            row: rowLabel,
            number,
            type,
            price,
            isBooked,
          });
        }
      });

      setSeats(seatData);
      setLoading(false);
    };

    fetchSeats();
  }, []);

  const handleSeatClick = (seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    return selectedSeats
      .reduce((total, seatId) => {
        const seat = seats.find((s) => s.id === seatId);
        return total + (seat?.price || 0);
      }, 0)
      .toFixed(2);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    navigate('/payment', {
      state: {
        show: movie,
        theater: cinemaLocation,
        time: selectedTime,
        selectedSeats,
        totalPrice: calculateTotal()
      }
    });
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <div className="loading">Loading seating arrangement...</div>;
  }

  if (error) {
    return <div className="error" role="alert">{error}</div>;
  }

  if (!movie || !selectedTime || !cinemaLocation) {
    return <div className="error" role="alert">Missing movie or showtime information</div>;
  }

  // Group seats by row for rendering
  const rows = seats.reduce((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="cinema-seating">
      <div className="cinema-info">
        <h2>Select Seats</h2>
        <p>
          {movie.title} | {cinemaLocation} | {selectedTime}
        </p>
      </div>

      <div className="screen" aria-hidden="true">
        <span>SCREEN</span>
      </div>

      <div className="seats-container">
        {Object.keys(rows).map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {rows[row].map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${seat.isBooked ? 'booked' : 'available'}${selectedSeats.includes(seat.id) ? ' selected' : ''} ${seat.type}`}
                  onClick={() => handleSeatClick(seat.id)}
                  disabled={seat.isBooked}
                  aria-label={`Seat ${seat.number} in row ${seat.row}, ${seat.type}, ${
                    seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'
                  }`}
                  title={`Row ${seat.row}, Seat ${seat.number} (${seat.type}, ${seat.price} EGP)`}
                >
                  {seat.type === 'accessible' ? '♿' : seat.number}
                </button>
              ))}
            </div>
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat available" aria-hidden="true"></div>
          <span>Regular Seat</span>
        </div>
        <div className="legend-item">
          <div className="seat premium" aria-hidden="true"></div>
          <span>Premium Seat</span>
        </div>
        <div className="legend-item">
          <div className="seat vip" aria-hidden="true"></div>
          <span>VIP Seat</span>
        </div>
        <div className="legend-item">
          <div className="seat accessible" aria-hidden="true"></div>
          <span>Accessible</span>
        </div>
        <div className="legend-item">
          <div className="seat selected" aria-hidden="true"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked" aria-hidden="true"></div>
          <span>Unavailable</span>
        </div>
      </div>

      <div className="booking-summary">
        <p>{selectedSeats.length > 0 ? `${selectedSeats.length} seats selected` : 'No seats selected'}</p>
        <p>Total: {calculateTotal()} EGP</p>
        <div className="button-group">
          <button
            className="back-button"
            onClick={handleCancel}
            aria-label="Back to movies"
          >
            Back to Movies
          </button>
          <button
            className="cancel-button"
            onClick={() => setSelectedSeats([])}
            disabled={selectedSeats.length === 0}
            aria-label="Cancel booking"
          >
            Cancel Booking
          </button>
          <button
            className="book-button"
            onClick={handleBooking}
            disabled={selectedSeats.length === 0 || loading}
            aria-busy={loading}
          >
            {loading ? 'Processing...' : 'Confirm Selection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaSeating;