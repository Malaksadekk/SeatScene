import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LocationSelection.css';

const LOCATIONS = [
  'Mokattam',
  'Madinet nasr',
  'Tagamo3',
  'Maadi',
  'Sheraton'
];

const LocationSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venue = location.state?.venue || 'cinema';

  const handleLocationClick = (loc) => {
    if (venue === 'cinema') {
      navigate('/movies', { state: { location: loc } });
    } else {
      navigate('/theater', { state: { location: loc } });
    }
  };

  return (
    <div className="location-selection-container">
      <h1 className="location-title">Location:</h1>
      <div className="location-btns">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            className="location-btn"
            onClick={() => handleLocationClick(loc)}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelection;
