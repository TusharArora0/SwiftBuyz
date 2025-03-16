// API configuration
export const API_URL = 'https://swiftbuyz-five.vercel.app/api';

// Helper function to create full API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/test`);
    if (!response.ok) {
      const text = await response.text();
      console.error('API test failed:', text);
      return { success: false, message: text };
    }
    const data = await response.json();
    console.log('API test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('API test error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function for authenticated API calls
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);
  
  return fetch(url, {
    ...options,
    headers
  });
}; 