import React, { useState } from 'react';
import './Forms.css';

const AddTheaterForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    screens: [{ number: 1, seats: '' }],
    amenities: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScreenChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      screens: prev.screens.map((screen, i) => 
        i === index ? { ...screen, [field]: value } : screen
      )
    }));
  };

  const handleAddScreen = () => {
    setFormData(prev => ({
      ...prev,
      screens: [...prev.screens, { number: prev.screens.length + 1, seats: '' }]
    }));
  };

  const handleRemoveScreen = (index) => {
    setFormData(prev => ({
      ...prev,
      screens: prev.screens.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(amenity => amenity !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/theaters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add theater');
      }

      const data = await response.json();
      onSuccess(data);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Add New Theater</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Theater Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Total Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Screens</label>
            {formData.screens.map((screen, index) => (
              <div key={index} className="screen-input-group">
                <input
                  type="number"
                  placeholder="Screen Number"
                  value={screen.number}
                  onChange={e => handleScreenChange(index, 'number', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Seats"
                  value={screen.seats}
                  onChange={e => handleScreenChange(index, 'seats', e.target.value)}
                  required
                />
                {formData.screens.length > 1 && (
                  <button type="button" onClick={() => handleRemoveScreen(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddScreen} className="add-screen-btn">
              Add Screen
            </button>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-list">
              {['VIP Seating', 'Dolby Atmos', '3D', 'IMAX'].map((amenity, idx) => (
                <label key={idx}>
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Theater'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTheaterForm; 