import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/SeatScene logo.png';
import visaImg from '../../assets/visa-512.webp';
import fawryImg from '../../assets/unnamed.webp';
import vodafoneImg from '../../assets/voda-cash.png';
import mastercardImg from '../../assets/png-clipart-mastercard-logo-credit-card-visa-brand-mastercard-text-label-thumbnail.png';
import paypalImg from '../../assets/pngimg.com - paypal_PNG7.png';
import appleImg from '../../assets/unnamed.png';
import './Payment.css';
const paymentMethods = [
  { id: 'fawry', src: fawryImg, alt: 'Fawry' },
  { id: 'vodafone', src: vodafoneImg, alt: 'Vodafone Cash' },
  { id: 'paypal', src: paypalImg, alt: 'PayPal' },
  { id: 'visa', src: visaImg, alt: 'Visa' },
  { id: 'mastercard', src: mastercardImg, alt: 'Mastercard' },
  { id: 'apple', src: appleImg, alt: 'Apple Pay' }
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Keep dummy data as fallback for direct access/testing
  const { show, theater, time, selectedSeats, totalPrice } = location.state || {
    show: 'Test Show',
    theater: 'Test Theater',
    time: '7:00 PM',
    selectedSeats: ['A1', 'A2'],
    totalPrice: 200
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handleContinue = () => {
    navigate('/card-details', {
      state: {
        show,
        theater,
        time,
        selectedSeats,
        totalPrice,
        paymentMethod: selectedPaymentMethod
      }
    });
  };

  return (
    <div className="payment-container">
      <div className="logo-section">
        <img 
          src={logoImg} 
          alt="Seat Scene Logo" 
          className="logo-img" 
          onClick={() => navigate('/theater-shows')} 
          style={{ cursor: 'pointer' }}
        />
      </div>
      
      <h1 className="payment-title">Choose your payment method:</h1>
      
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
            onClick={() => setSelectedPaymentMethod(method.id)}
          >
            <img src={method.src} alt={method.alt} />
          </div>
        ))}
      </div>
      
      <div className="booking-summary">
        <p className="summary-item">Total: <span className="highlight">{totalPrice} EGP</span></p>
        <p className="summary-item">Seats: <span className="highlight">{selectedSeats.join(', ')}</span></p>
        <p className="summary-item">Time: <span className="highlight">{time}</span></p>
      </div>
      
      <button
        className="continue-button"
        disabled={!selectedPaymentMethod}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default Payment;