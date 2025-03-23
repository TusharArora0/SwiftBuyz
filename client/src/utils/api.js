import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { API_URL } from './apiConfig';

export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    store.dispatch(logout());
  }
  throw error;
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  // Ensure URL is properly formatted
  const formattedUrl = url.startsWith('http') 
    ? url 
    : url.startsWith('/') 
      ? `${API_URL}${url}`
      : `${API_URL}/${url}`;

  const response = await fetch(formattedUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    store.dispatch(logout());
    throw new Error('Unauthorized');
  }

  return response;
}; 