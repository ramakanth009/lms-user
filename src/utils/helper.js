// src/utils/helper.js

/**
 * Helper utility functions
 * Contains general-purpose utility functions used across the application
 */

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string to format
 * @param {Object} options - Date formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
  };
  
  /**
   * Format time in seconds to MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string (MM:SS)
   */
  export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  /**
   * Get relative time (e.g., "2 hours ago") from a date string
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time string
   */
  export const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString, { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };
  
  /**
   * Format role name from snake_case to Title Case
   * @param {string} role - Role name in snake_case
   * @returns {string} Formatted role name
   */
  export const formatRoleName = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Truncate text with ellipsis if it exceeds max length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Group array items by a key
   * @param {Array} array - Array to group
   * @param {string} key - Key to group by
   * @returns {Object} Grouped object
   */
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  /**
   * Split text by newlines and filter empty lines
   * @param {string} text - Text with newlines
   * @returns {Array} Array of non-empty lines
   */
  export const formatBulletPoints = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };
  
  /**
   * Calculate percentage and format to 1 decimal place
   * @param {number} value - Value
   * @param {number} total - Total
   * @returns {string} Formatted percentage
   */
  export const calculatePercentage = (value, total) => {
    if (!total) return '0.0';
    return ((value / total) * 100).toFixed(1);
  };
  
  /**
   * Scroll smoothly to top of page
   */
  export const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  /**
   * Get first letter of string, uppercase
   * @param {string} str - Input string
   * @returns {string} First letter, uppercase
   */
  export const getInitials = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase();
  };
  
  /**
   * Extract first name from full name
   * @param {string} fullName - Full name
   * @returns {string} First name
   */
  export const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };
  
  /**
   * Convert file size in bytes to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Get query parameters from URL as object
   * @returns {Object} Query parameters
   */
  export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
      result[key] = value;
    }
    
    return result;
  };
  
  /**
   * Create URL with query parameters
   * @param {string} baseUrl - Base URL
   * @param {Object} params - Query parameters
   * @returns {string} URL with query parameters
   */
  export const createUrlWithParams = (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  };
  
  /**
   * Debounce function to limit how often a function can be called
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  export default {
    formatDate,
    formatTime,
    getTimeAgo,
    formatRoleName,
    truncateText,
    groupBy,
    formatBulletPoints,
    calculatePercentage,
    scrollToTop,
    getInitials,
    getFirstName,
    formatFileSize,
    getQueryParams,
    createUrlWithParams,
    debounce,
    deepClone
  };