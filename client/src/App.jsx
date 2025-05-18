import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Admin from './pages/AdminDashboard/Admin';
import NavHeader from './componets/NavHeader';
import CinemaMovies from './pages/CinemaMovies/CinemaMovies';
import CinemaSeating from './pages/CinemaSeating/CinemaSeating';
import Homepage from './pages/homepage/home';
import VenueSelection from './pages/VenueSelection/VenueSelection';
import TheaterShows from './pages/TheaterShows/TheaterShows';
import LocationSelection from './pages/LocationSelection/LocationSelection';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {!isHome && <NavHeader />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <CinemaMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theater"
          element={
            <ProtectedRoute>
              <TheaterShows />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seating"
          element={
            <ProtectedRoute>
              <CinemaSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theater-seating/:showId"
          element={
            <ProtectedRoute>
              {/* TheaterSeating removed */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        {/* Homepage route */}
        <Route path="/" element={<Homepage />} />
        <Route path="/venue-selection" element={<VenueSelection />} />
        <Route path="/location-selection" element={<LocationSelection />} />
      </Routes>
    </>
  );
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
