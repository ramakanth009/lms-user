// src/services/auth.js (Updated with StorageService)
import axios from 'axios';
import StorageService from './storage';

const API_URL = 'http://localhost:8000/api';

const Auth = {
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/auth/student/login/`, {
        email,
        password,
      });

      if (response.data.access) {
        // Use storage service instead of direct localStorage calls
        StorageService.setAuthData(response.data, rememberMe, email);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const authData = StorageService.getAuthData();
      
      if (authData.refreshToken) {
        // Call the logout endpoint to blacklist the token
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh: authData.refreshToken
        }, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`
          }
        });
      }
      
      // Clear all authentication data
      StorageService.clearAuthData();
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the server request fails, clear auth data
      StorageService.clearAuthData();
      
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const { refreshToken } = StorageService.getAuthData();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken
      });
      
      if (response.data.access) {
        // Store new tokens
        StorageService.setAuthData(response.data);
      }
      
      return response.data;
    } catch (error) {
      // If refresh fails, log the user out
      Auth.logout();
      throw error;
    }
  },

  getCurrentUser: () => {
    return {
      isAuthenticated: StorageService.getAuthData().isAuthenticated
    };
  },

  // Setup axios interceptors to handle token refresh
  setupAxiosInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshResponse = await Auth.refreshToken();
            
            // If successful, update the header and retry
            if (refreshResponse.access) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.access}`;
              originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.access}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, log the user out
            console.error('Token refresh failed:', refreshError);
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
};

export default Auth;