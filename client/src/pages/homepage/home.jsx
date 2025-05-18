import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import logo from '../../assets/SeatScene logo.png'; // Adjust the path/filename as needed

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <img src={logo} alt="Seat Scene Logo" className="homepage-logo" />
      <h1 className="homepage-title">SEAT SCENE</h1>
      <button className="homepage-continue" onClick={() => navigate('/login')}>
        Continue
      </button>
    </div>
  );
};

export default Homepage;
