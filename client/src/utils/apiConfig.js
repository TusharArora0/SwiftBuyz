// API configuration
export const API_URL = 'https://swiftbuyz-five.vercel.app/api';
// Fallback URL if the main one fails
export const FALLBACK_API_URL = 'https://swiftbuyz-1belqlz6y-tushararora0s-projects.vercel.app/api';

// Helper function to create full API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

// Test API connection
export const testApiConnection = async () => {
  try {
    // Try the main API URL first
    const response = await fetch(`${API_URL}/auth/test`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add these options to help with CORS and network issues
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      timeout: 5000 // 5 second timeout
    });
    
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
    
    // Try the fallback URL
    try {
      console.log('Trying fallback API URL...');
      const fallbackResponse = await fetch(`${FALLBACK_API_URL}/auth/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback API test successful:', fallbackData);
        return { 
          success: true, 
          data: fallbackData,
          message: 'Connected using fallback API'
        };
      }
    } catch (fallbackError) {
      console.error('Fallback API test error:', fallbackError);
    }
    
    return { 
      success: false, 
      error: error.message,
      message: 'Both main and fallback API connections failed'
    };
  }
};

// Helper function for authenticated API calls with fallback
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);
  
  try {
    return await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    // If the main URL fails and the endpoint doesn't start with http (meaning it's a relative path)
    if (!endpoint.startsWith('http')) {
      const fallbackUrl = `${FALLBACK_API_URL}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
      console.log(`Trying fallback URL: ${fallbackUrl}`);
      
      return fetch(fallbackUrl, {
        ...options,
        headers,
        mode: 'cors',
        cache: 'no-cache'
      });
    }
    
    throw error;
  }
}; 