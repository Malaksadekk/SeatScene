import React, { useState, useEffect } from 'react';
import './Forms.css';

const EditTheaterForm = ({ theater, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    screens: [{ number: 1, seats: '' }],
    amenities: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (theater) {
      setFormData({
        name: theater.name || '',
        location: theater.location || '',
        capacity: theater.capacity || '',
        screens: theater.screens || [{ number: 1, seats: '' }],
        amenities: theater.amenities || []
      });
    }
  }, [theater]);

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
      const response = await fetch(`/api/admin/theaters/${theater._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update theater');
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
        <h2>Edit Theater</h2>
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
              <div key={index} className="screen-input">
                <input
                  type="number"
                  value={screen.number}
                  onChange={(e) => handleScreenChange(index, 'number', e.target.value)}
                  placeholder="Screen Number"
                  required
                />
                <input
                  type="number"
                  value={screen.seats}
                  onChange={(e) => handleScreenChange(index, 'seats', e.target.value)}
                  placeholder="Number of Seats"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveScreen(index)}
                    className="remove-screen"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddScreen}
              className="add-screen"
            >
              Add Screen
            </button>
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Dolby Atmos"
                  checked={formData.amenities.includes('Dolby Atmos')}
                  onChange={handleAmenityChange}
                />
                Dolby Atmos
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Wheelchair Access"
                  checked={formData.amenities.includes('Wheelchair Access')}
                  onChange={handleAmenityChange}
                />
                Wheelchair Access
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Food Service"
                  checked={formData.amenities.includes('Food Service')}
                  onChange={handleAmenityChange}
                />
                Food Service
              </label>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Theater'}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTheaterForm; 