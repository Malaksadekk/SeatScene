const API_URL = '/api/theaters';

// Get all theater shows
export const getAllTheaterShows = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error('Failed to fetch theater shows');
    return await response.json();
  } catch (error) {
    console.error('Error fetching theater shows:', error);
    throw error;
  }
}; 