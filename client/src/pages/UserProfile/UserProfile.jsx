import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import logo from '../../assets/profile-placeholder.png';

const UserProfile = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  // Get user data from localStorage instead of fetching
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Static bookings data
  const mockBookings = [
    {
      _id: "1",
      eventName: "A Working Man",
      eventType: "Movie",
      date: "2024-05-24",
      time: "7:00 PM",
      venue: "Mokattam",
      seats: ["D4", "D5"],
      totalPrice: 360,
      status: "upcoming"
    },
    {
      _id: "2",
      eventName: "Hamlet",
      eventType: "Theater",
      date: "2024-05-30",
      time: "7:30 PM",
      venue: "Maadi",
      seats: ["C8", "C9", "C10"],
      totalPrice: 450,
      status: "history"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="booking-card">
      <div className="booking-type">{booking.eventType}</div>
      <h3 className="booking-title">{booking.eventName}</h3>
      
      <div className="booking-details">
        <div className="detail-row">
          <span>Date:</span>
          <span>{booking.date}</span>
        </div>
        <div className="detail-row">
          <span>Time:</span>
          <span>{booking.time}</span>
        </div>
        <div className="detail-row">
          <span>Venue:</span>
          <span>{booking.venue}</span>
        </div>
        <div className="detail-row">
          <span>Seats:</span>
          <span>{booking.seats.join(', ')}</span>
        </div>
        <div className="detail-row">
          <span>Price:</span>
          <span>{booking.totalPrice} EGP</span>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  const filteredBookings = mockBookings.filter(booking => 
    activeTab === 'upcoming' ? booking.status === 'upcoming' : booking.status === 'history'
  );

  return (
    <div className="profile-container">
      <div className="profile-left">
        <div className="profile-logo">
          <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
        
        <button
          className={`profile-action-btn${activeButton === 'book' ? ' active' : ''}`}
          onClick={() => { setActiveButton('book'); navigate('/venue-selection'); }}
        >
          Book New Ticket
        </button>
        <button
          className={`logout-btn${activeButton === 'logout' ? ' active' : ''}`}
          onClick={() => { setActiveButton('logout'); handleLogout(); }}
        >
          Logout
        </button>
      </div>

      <div className="profile-right">
        <div className="booking-toggle-buttons">
          <button
            className={`booking-toggle${activeTab === 'upcoming' ? ' active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bookings
          </button>
          <button
            className={`booking-toggle${activeTab === 'history' ? ' active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Booking History
          </button>
        </div>

        <div className="bookings-list">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(renderBookingCard)
          ) : (
            <div className="no-bookings">
              No {activeTab} bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;