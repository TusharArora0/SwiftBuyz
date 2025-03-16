import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

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

  const response = await fetch(url, {
    ...options,
    headers: {
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