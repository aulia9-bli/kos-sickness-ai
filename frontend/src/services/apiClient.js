import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const analyzeSickness = async (complaint) => {
  try {
    const response = await apiClient.post('/api/analyze-sickness', {
      complaint,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error analyzing sickness' };
  }
};

export default apiClient;
