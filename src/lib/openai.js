import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function generateGiftSuggestions(recipient) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_URL}/gifts/suggestions`,
      { name: recipient.name },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data.map(suggestion => ({
      ...suggestion,
      image: suggestion.imageUrl // Map backend imageUrl to frontend image property
    }));
  } catch (error) {
    console.error('Error generating gift suggestions:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate gift suggestions. Please try again later.');
  }
}