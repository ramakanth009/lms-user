// src/utils/notificationUtils.js
/**
 * Utility functions for handling toast/snackbar notifications
 * and standardizing API response messages
 */

/**
 * Get appropriate notification message and type from API response
 * @param {Object} response - API response data
 * @returns {Object} Object with message and severity
 */
export const getNotificationFromResponse = (response) => {
    // Default settings
    let message = 'Operation completed successfully';
    let severity = 'success';
    
    // Check if response has a message
    if (response?.message) {
      message = response.message;
    }
    
    // Check for status or error indicators
    if (response?.status === 'error' || response?.error) {
      severity = 'error';
      message = response.message || response.error || 'An error occurred';
    }
    
    return { message, severity };
  };
  
  /**
   * Get appropriate error message from error object
   * @param {Error} error - Error object or axios error response
   * @returns {Object} Object with message and severity
   */
  export const getNotificationFromError = (error) => {
    let message = 'An error occurred';
    const severity = 'error';
    
    // Handle axios error responses
    if (error.response) {
      // Server responded with error
      if (error.response.data?.message) {
        message = error.response.data.message;
      } else if (error.response.data?.error) {
        message = error.response.data.error;
      } else if (error.response.data?.detail) {
        message = error.response.data.detail;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else {
        message = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      message = 'No response from server. Please check your connection.';
    } else if (error.message) {
      // Error setting up request
      message = error.message;
    }
    
    return { message, severity };
  };
  
  /**
   * Create a standard format for snackbar state
   * @param {string} message - Notification message
   * @param {string} severity - Notification severity (success, error, info, warning)
   * @param {boolean} open - Whether notification is open
   * @returns {Object} Snackbar state object
   */
  export const createSnackbarState = (message, severity = 'info', open = true) => {
    return {
      open,
      message,
      severity
    };
  };
  
  export default {
    getNotificationFromResponse,
    getNotificationFromError,
    createSnackbarState
  };