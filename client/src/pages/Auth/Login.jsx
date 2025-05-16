import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'admin@seatscene.com',
    password: 'admin123'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  // Check localStorage on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setDebugInfo({
          tokenExists: true,
          user: userData
        });
      } catch (e) {
        setDebugInfo({
          tokenExists: !!token,
          userParseError: e.message
        });
      }
    } else {
      setDebugInfo({
        tokenExists: !!token,
        userExists: !!user
      });
    }
  }, []);

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

    try {
      console.log('Sending login request with:', formData);
      
      // Show loading toast
      const loadingToast = toast.loading('Logging in...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Add debug information
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers])
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        toast.dismiss(loadingToast);
        toast.error('Server returned non-JSON response. Please check if the server is running.');
        throw new Error('Server returned non-JSON response. Please check if the server is running.');
      }

      const data = await response.json();
      
      // Update debug info with response data
      setDebugInfo(prev => ({
        ...prev,
        responseData: data
      }));

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.message || 'Login failed');
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update debug info again
      setDebugInfo(prev => ({
        ...prev,
        localStorage: {
          token: data.token ? data.token.substring(0, 20) + '...' : null,
          user: data.user
        }
      }));

      // Show success toast and redirect
      toast.dismiss(loadingToast);
      toast.success('Login successful!');

      // Redirect based on user role with delay
      if (data.user.role === 'admin') {
        toast.info('Redirecting to admin dashboard...');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        toast.info('Redirecting to movies...');
        setTimeout(() => navigate('/movies'), 1500);
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
      
      // Update debug info with error
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
        stack: error.stack
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="auth-form-container">
        <h2>Login to SeatScene</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className={`auth-button ${loading ? 'loading' : ''}`}>
            <FaSignInAlt className="button-icon" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        
        {/* Debug information */}
        {debugInfo && (
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px' }}>Debug Info</h3>
            <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '200px', fontSize: '12px' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 