import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Admin from './pages/AdminDashboard/Admin';
import NavHeader from './pages/Shared/NavHeader';
import TheaterSeating from './pages/TheaterSeating/TheaterSeating';
import CinemaMovies from './pages/CinemaMovies/CinemaMovies';
import CinemaSeating from './pages/CinemaSeating/CinemaSeating';
import Homepage from './pages/homepage/home';
import VenueSelection from './pages/VenueSelection/VenueSelection';
import TheaterShows from './pages/TheaterShows/TheaterShows';
import LocationSelection from './pages/LocationSelection/LocationSelection';
import Payment from './pages/Payment/Payment';
import CardDetails from './pages/CardDetails/CardDetails';
import Confirmation from './pages/Confirmation/Confirmation';

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
          path="/CinemaSeating"
          element={
            <ProtectedRoute>
              <CinemaSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TheaterSeating"
          element={
            <ProtectedRoute>
              <TheaterSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TheaterSeating/:showId"
          element={
            <ProtectedRoute>
              <TheaterSeating />
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
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card-details"
          element={
            <ProtectedRoute>
              <CardDetails />
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
        <Route path="/payment" element={<Payment />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/theater-shows" element={<TheaterShows />} />
        <Route path="/cinema-seating" element={<CinemaSeating />} />
        <Route path="/TheaterSeating/:showId" element={<TheaterSeating />} />
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
