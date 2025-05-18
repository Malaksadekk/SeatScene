const API_URL = '/api';  // Use the proxy instead of hardcoded URL

// Helper function to handle API calls
const handleResponse = async (response) => {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error response:', error);
    throw new Error(error.message || 'Something went wrong');
  }
  
  const data = await response.json();
  console.log('API Response data:', data);
  return data;
};

// Get all movies
export const getAllMovies = async () => {
  try {
    console.log('Making API call to:', `${API_URL}/movies`);
    const response = await fetch(`${API_URL}/movies`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Raw API response:', response);
    return handleResponse(response);
  } catch (error) {
    console.error('Error in getAllMovies:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Get a single movie by ID
export const getMovieById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/movies/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genre) => {
  try {
    const response = await fetch(`${API_URL}/movies/genre/${encodeURIComponent(genre)}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching movies by genre ${genre}:`, error);
    throw error;
  }
};

// Get upcoming movies
export const getUpcomingMovies = async () => {
  try {
    const response = await fetch(`${API_URL}/movies/upcoming/all`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${API_URL}/movies/search?query=${encodeURIComponent(query)}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error searching movies with query ${query}:`, error);
    throw error;
  }
};

// Get movie showtimes
export const getMovieShowtimes = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/movies/${movieId}/showtimes`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching showtimes for movie ${movieId}:`, error);
    throw error;
  }
};

// Add request interceptor for authentication if needed
const addAuthHeader = (headers = {}) => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return headers;
};

// Update the fetch calls to include auth headers
const fetchWithAuth = async (url, options = {}) => {
  const headers = addAuthHeader(options.headers);
  const response = await fetch(url, { ...options, headers });
  return handleResponse(response);
};

// Export the fetchWithAuth function for components that need authenticated requests
export { fetchWithAuth };
