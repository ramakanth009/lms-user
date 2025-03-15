// src/services/storage.js

/**
 * Storage Service
 * Provides a unified interface for handling local/session storage operations
 */

// Authentication-related storage
const AUTH_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    IS_AUTHENTICATED: 'isAuthenticated',
    REMEMBERED_EMAIL: 'rememberedEmail'
  };
  
  /**
   * Store authentication data in local storage
   * @param {Object} tokens - Object containing access and refresh tokens
   * @param {boolean} rememberMe - Whether to remember the user's email
   * @param {string} email - User's email to remember (if rememberMe is true)
   */
  const setAuthData = (tokens, rememberMe = false, email = null) => {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, tokens.access);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, tokens.refresh || '');
    localStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, 'true');
    
    if (rememberMe && email) {
      localStorage.setItem(AUTH_KEYS.REMEMBERED_EMAIL, email);
    } else {
      localStorage.removeItem(AUTH_KEYS.REMEMBERED_EMAIL);
    }
  };
  
  /**
   * Get authentication data from local storage
   * @returns {Object} Object containing auth data
   */
  const getAuthData = () => {
    return {
      accessToken: localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN),
      refreshToken: localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),
      isAuthenticated: localStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === 'true',
      rememberedEmail: localStorage.getItem(AUTH_KEYS.REMEMBERED_EMAIL)
    };
  };
  
  /**
   * Clear authentication data from local storage
   */
  const clearAuthData = () => {
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
    // Note: We intentionally don't clear remembered email
  };
  
  /**
   * Store user preference in local storage
   * @param {string} key - Preference key
   * @param {any} value - Preference value (will be JSON stringified)
   */
  const setUserPreference = (key, value) => {
    localStorage.setItem(`pref_${key}`, JSON.stringify(value));
  };
  
  /**
   * Get user preference from local storage
   * @param {string} key - Preference key
   * @param {any} defaultValue - Default value if preference doesn't exist
   * @returns {any} Parsed preference value or default value
   */
  const getUserPreference = (key, defaultValue = null) => {
    const value = localStorage.getItem(`pref_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  };
  
  /**
   * Remove user preference from local storage
   * @param {string} key - Preference key to remove
   */
  const removeUserPreference = (key) => {
    localStorage.removeItem(`pref_${key}`);
  };
  
  /**
   * Store temporary data in session storage
   * @param {string} key - Session data key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  const setSessionData = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  
  /**
   * Get temporary data from session storage
   * @param {string} key - Session data key
   * @param {any} defaultValue - Default value if session data doesn't exist
   * @returns {any} Parsed session data or default value
   */
  const getSessionData = (key, defaultValue = null) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  };
  
  /**
   * Remove temporary data from session storage
   * @param {string} key - Session data key to remove
   */
  const clearSessionData = (key) => {
    sessionStorage.removeItem(key);
  };
  
  /**
   * Clear all session storage data
   */
  const clearAllSessionData = () => {
    sessionStorage.clear();
  };
  
  // For direct access to localStorage/sessionStorage with automatic JSON parsing
  const storage = {
    // Local storage with JSON parsing
    local: {
      set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
      get: (key, defaultValue = null) => {
        const value = localStorage.getItem(key);
        try {
          return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
          return value || defaultValue;
        }
      },
      remove: (key) => localStorage.removeItem(key),
      clear: () => localStorage.clear()
    },
    
    // Session storage with JSON parsing
    session: {
      set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
      get: (key, defaultValue = null) => {
        const value = sessionStorage.getItem(key);
        try {
          return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
          return value || defaultValue;
        }
      },
      remove: (key) => sessionStorage.removeItem(key),
      clear: () => sessionStorage.clear()
    }
  };
  
  export default {
    AUTH_KEYS,
    setAuthData,
    getAuthData,
    clearAuthData,
    setUserPreference,
    getUserPreference,
    removeUserPreference,
    setSessionData,
    getSessionData,
    clearSessionData,
    clearAllSessionData,
    storage
  };