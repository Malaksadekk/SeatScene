import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueSelection.css';

const VenueSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="venue-selection-container">
      <button
        className="venue-btn"
        onClick={() => navigate('/location-selection', { state: { venue: 'cinema' } })}
      >
        Cinema
      </button>
      <button
        className="venue-btn"
        onClick={() => navigate('/location-selection', { state: { venue: 'theater' } })}
      >
        Theater
      </button>
    </div>
  );
};

export default VenueSelection;