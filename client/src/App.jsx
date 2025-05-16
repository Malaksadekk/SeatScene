import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Admin from './pages/AdminDashboard/Admin';
import NavHeader from './componets/NavHeader';
import CinemaMovies from './pages/CinemaMovies/CinemaMovies';
import CinemaSeating from './pages/CinemaSeating/CinemaSeating';

function AppContent() {
  return (
    <>
      <NavHeader />
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
          path="/seating"
          element={
            <ProtectedRoute>
              <CinemaSeating />
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
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
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
