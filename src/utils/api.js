const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add request logging helper
const logRequest = (method, endpoint, status, data) => {
  console.log(`API ${method} ${endpoint} → ${status}`, data);
};

export const fetchProgress = async (userId) => {
  try {
    const endpoint = `/progress/${userId}`;
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    logRequest('GET', endpoint, response.status, data);
    return data;
    
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    logRequest('GET', '/progress', 'FAILED', { error: error.message });
    return []; // Return empty array as fallback
  }
};

export const saveProgress = async (userId, data) => {
  try {
    const endpoint = '/progress';
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...data })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    logRequest('POST', endpoint, response.status, result);
    return result;
    
  } catch (error) {
    console.error('Failed to save progress:', error);
    logRequest('POST', '/progress', 'FAILED', { 
      error: error.message,
      attemptedData: data 
    });
    return null;
  }
};

// Add this to test connection on app startup
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};