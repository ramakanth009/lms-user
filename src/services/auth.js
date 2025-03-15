// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const Auth = {
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/auth/student/login/`, {
        email,
        password,
      });

      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // Call the logout endpoint to blacklist the token
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh: refreshToken
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }
      
      // Clear all local storage items related to authentication
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the server request fails, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken
      });
      
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        
        // If a new refresh token is provided, update it
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
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
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
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