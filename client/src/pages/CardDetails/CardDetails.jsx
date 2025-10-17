import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CardDetails.css';
import logoImg from '../../assets/SeatScene logo.png';

const CardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dummy data fallback for direct access/testing
  const {
    show,
    theater,
    time,
    selectedSeats,
    totalPrice,
    paymentMethod
  } = location.state || {
    show: 'Test Show',
    theater: 'Test Theater',
    time: '7:00 PM',
    selectedSeats: ['A1', 'A2'],
    totalPrice: 200,
    paymentMethod: 'visa'
  };

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if it's a card payment method
  const isCardPayment = ['visa', 'mastercard', 'paypal'].includes(paymentMethod);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (isCardPayment) {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!cardName) {
        newErrors.cardName = 'Please enter the name on card';
      }
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter a valid expiry date';
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    } else {
      if (!phoneNumber || phoneNumber.length < 10) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
      if (!password) {
        newErrors.password = 'Please enter your password';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/confirmation', {
        state: {
          show: location.state?.show || { title: 'A Working Man' },
          theater: location.state?.theater || 'Mokattam',
          time: location.state?.time || '7:00 PM',
          selectedSeats: location.state?.seats || ['A1', 'A2'],
          totalPrice: location.state?.totalPrice || 200,
          paymentMethod: 'Credit Card'
        }
      });
    }, 1500);
  };

  // Handle back button
  const handleBack = () => {
    navigate('/payment', {
      state: {
        show,
        theater,
        time,
        selectedSeats,
        totalPrice
      }
    });
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/theater-shows');
  };

  // Prevent rendering if data is missing (shouldn't happen with dummy fallback)
  if (!show || !selectedSeats || !paymentMethod) {
    return null;
  }

  return (
    <div className="card-details-container">
      <div className="logo-section">
        <img
          src={logoImg}
          alt="Seat Scene Logo"
          className="logo-img"
          onClick={() => navigate('/theater-shows')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="card-details-card">
        <h1>{isCardPayment ? 'Enter Card Details' : 'Enter Account Details'}</h1>

        <form onSubmit={handleSubmit} className="payment-form">
          {isCardPayment ? (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                />
                {errors.cardName && <span className="error">{errors.cardName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
                </div>

                <div className="form-group half">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="password"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && <span className="error">{errors.cvv}</span>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
            </>
          )}

          <div className="booking-summary">
            <p className="summary-item">Total: <span className="highlight">{totalPrice} EGP</span></p>
            <p className="summary-item">Seats: <span className="highlight">{selectedSeats.join(', ')}</span></p>
            <p className="summary-item">Time: <span className="highlight">{time}</span></p>
          </div>

          <div className="form-actions">
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="pay-button" disabled={loading}>
              {loading ? 'Processing...' : `Pay ${totalPrice} EGP`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardDetails;
