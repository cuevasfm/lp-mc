// API Configuration
const getAPIBaseURL = () => {
  // Check if we're in development or production
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default fallbacks
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8000/api';
  }
  
  // Production URL - update this with your actual API URL
  return 'https://your-api-domain.com/api';
};

export const API_BASE_URL = getAPIBaseURL();

// Default headers for API requests
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Helper function to make API requests with error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Parse JSON response regardless of status
    const data = await response.json();
    
    if (!response.ok) {
      // For validation errors (422), return the data with error details
      if (response.status === 422) {
        console.log('Validation error response:', data);
        return {
          success: false,
          errors: data.errors || data.message || 'Validation error',
          status: response.status
        };
      }
      
      // For other errors, throw with the server message if available
      const errorMessage = data.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // If it's not a JSON response or network error
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response from server');
    }
    
    console.error('API request failed:', error);
    throw error;
  }
};