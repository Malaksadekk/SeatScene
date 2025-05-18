import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import logo from '../../assets/profile-placeholder.png';
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeButton, setActiveButton] = useState(null); // 'book' or 'logout'
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'history'
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords if changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data);
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Left column: User info and actions */}
      <div className="profile-left">
        <div className="profile-logo">
          <img
            src={logo}
            alt="Logo"
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-member">Member since: {new Date(user.createdAt).toLocaleDateString()}</div>
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
      {/* Right column: Bookings and tabs */}
      <div className="profile-right">
        {/* Toggle buttons for bookings */}
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
        {/* Bookings content placeholder (replace with your actual bookings rendering) */}
        <div style={{marginTop: '2rem', color: '#fff', fontSize: '1.2rem', textAlign: 'center'}}>
          {/* TODO: Render bookings here */}
          Your bookings will appear here.
        </div>
      </div>
    </div>
  );
};

export default UserProfile;