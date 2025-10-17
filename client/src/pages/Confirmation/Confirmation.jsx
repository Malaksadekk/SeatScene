import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { show, theater, time, selectedSeats, totalPrice, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!show || !selectedSeats || !totalPrice || !paymentMethod) {
      // If no booking data, redirect back to theater shows
      navigate('/theater-shows');
    }
  }, [show, selectedSeats, totalPrice, paymentMethod, navigate]);

  const handleBackToShows = () => {
    navigate('/theater-shows');
  };

  if (!show || !selectedSeats) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        
        <div className="booking-details">
          <h2>{show.title}</h2>
          <p>Time: {time}</p>
          <p>Seats: {selectedSeats.join(', ')}</p>
          <p>Total: {totalPrice} EGP</p>
          <p>Payment Method: {paymentMethod}</p>
        </div>
        
        <p className="confirmation-message">
          Your tickets have been sent to your email. Please show the QR code at the entrance.
        </p>
        
        <button className="back-button" onClick={handleBackToShows}>
          Back to Shows
        </button>
      </div>
    </div>
  );
};

export default Confirmation; 