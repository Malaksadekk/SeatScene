import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaUsers, FaFilm, FaTheaterMasks, FaTicketAlt } from 'react-icons/fa';
import AddMovieForm from './components/AddMovieForm';
import AddTheaterForm from './components/AddTheaterForm';
import EditMovieForm from './components/EditMovieForm';
import EditTheaterForm from './components/EditTheaterForm';
import { FaRegUserCircle } from "react-icons/fa";
import { BiMovie } from "react-icons/bi";
import { FaMasksTheater } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    theaters: 0,
    tickets: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching stats from:', '/api/admin/stats');
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received stats:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Dashboard Content</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>{stats.users}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaFilm className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Movies</h3>
                  <p>{stats.movies}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaTheaterMasks className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Theaters</h3>
                  <p>{stats.theaters}</p>
                </div>
              </div>
              <div className="stat-card">
                <FaTicketAlt className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Tickets</h3>
                  <p>{stats.tickets}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'movies':
        return <MovieManagement />;
      case 'theaters':
        return <TheaterManagement />;
      case 'tickets':
        return <TicketManagement />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><RiAdminLine className="nav-icon" style={{ marginRight: '8px' }} /> Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <MdDashboardCustomize className="nav-icon" style={{ marginRight: '8px' }} />
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaRegUserCircle className="nav-icon" style={{ marginRight: '8px' }} />
            Users
          </button>
          <button 
            className={`nav-item ${activeSection === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveSection('movies')}
          >
            <BiMovie className="nav-icon" style={{ marginRight: '8px' }} />
            Movies
          </button>
          <button 
            className={`nav-item ${activeSection === 'theaters' ? 'active' : ''}`}
            onClick={() => setActiveSection('theaters')}
          >
            <FaMasksTheater className="nav-icon" style={{ marginRight: '8px' }} />
            Theaters
          </button>
          <button 
            className={`nav-item ${activeSection === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveSection('tickets')}
          >
            <IoTicketSharp className="nav-icon" style={{ marginRight: '8px' }} />
            Tickets
          </button>
          <button 
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <IoLogOut className="nav-icon" style={{ marginRight: '8px' }} />
            Logout
          </button>
        </nav>
      </div>
      <main className="main-content">
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`/api/admin/users/${updatedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      setUsers(prev => prev.map(user => 
        user._id === data._id ? data : user
      ));
      setEditingUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <h2>User Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Edit User</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateUser({
                ...editingUser,
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role')
              });
            }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  defaultValue={editingUser.role}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">Update User</button>
                <button type="button" onClick={() => setEditingUser(null)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Movie Management Component
const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newMovie) => {
    setMovies(prev => [...prev, newMovie]);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
  };

  const handleUpdateSuccess = (updatedMovie) => {
    setMovies(prev => prev.map(movie => 
      movie._id === updatedMovie._id ? updatedMovie : movie
    ));
    setEditingMovie(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      setMovies(prev => prev.filter(movie => movie._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Movie Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Movie
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Genre</th>
              <th>Capacity</th>
              <th>Screen Type</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.duration} min</td>
                <td>{movie.genre}</td>
                <td>{movie.capacity}</td>
                <td>{movie.screenType}</td>
                <td>
                  <div className="amenities-list">
                    {movie.amenities?.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <button onClick={() => handleEdit(movie)}>Edit</button>
                  <button onClick={() => handleDelete(movie._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && (
        <AddMovieForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}
      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

// Theater Management Component
const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/theaters');
      if (!response.ok) {
        throw new Error('Failed to fetch theaters');
      }
      const data = await response.json();
      setTheaters(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newTheater) => {
    setTheaters(prev => [...prev, newTheater]);
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
  };

  const handleUpdateSuccess = (updatedTheater) => {
    setTheaters(prev => prev.map(theater => 
      theater._id === updatedTheater._id ? updatedTheater : theater
    ));
    setEditingTheater(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/theaters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete theater');
      }

      setTheaters(prev => prev.filter(theater => theater._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Theater Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Theater
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Screens</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theaters.map(theater => (
              <tr key={theater._id}>
                <td>{theater.name}</td>
                <td>{theater.location}</td>
                <td>{theater.capacity}</td>
                <td>
                  <div className="screens-list">
                    {theater.screens?.map((screen, index) => (
                      <span key={index} className="screen-tag">
                        Screen {screen.number} ({screen.seats} seats)
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button onClick={() => handleEdit(theater)}>Edit</button>
                  <button onClick={() => handleDelete(theater._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddForm && (
        <AddTheaterForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddSuccess}
        />
      )}
      {editingTheater && (
        <EditTheaterForm
          theater={editingTheater}
          onClose={() => setEditingTheater(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

// Ticket Management Component
const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets');
      const data = await response.json();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="management-section">
      <h2>Ticket Management</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Movie</th>
              <th>Theater</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket._id}</td>
                <td>{ticket.userId}</td>
                <td>{ticket.movieId}</td>
                <td>{ticket.theaterId}</td>
                <td>{new Date(ticket.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(ticket._id)}>Edit</button>
                  <button onClick={() => handleDelete(ticket._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
