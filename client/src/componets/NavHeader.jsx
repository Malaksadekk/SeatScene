import React from 'react';
import './NavHeader.css';
import logoImg from '../assets/SeatScene logo.png'; // Make sure this path matches your logo image
import { useNavigate, useLocation } from 'react-router-dom';

const NavHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Hide button on login, register, any /admin route, and /profile
  const hideProfileBtn =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/profile';

  const handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="nav-header">
      <div className="logo-section">
        <img src={logoImg} alt="Seat Scene Logo" className="logo-img" />
      </div>
      {!hideProfileBtn && (
        <button className="profile-btn" onClick={handleProfileClick}>
          <span className="profile-icon">👤</span> My Profile
        </button>
      )}
    </nav>
  );
};

export default NavHeader;
