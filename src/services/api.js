// src/config/apiConfig.js

// Base API URL
export const API_BASE_URL = 'http://localhost:8000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/student/login/',
  LOGOUT: '/auth/logout/',
  REFRESH_TOKEN: '/token/refresh/',
  VERIFY_TOKEN: '/token/verify/'
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  DASHBOARD: '/student/student_dashboard/',
  PROFILE: '/student/my_profile/',
  UPDATE_PROFILE: '/student/update_profile/',
  REQUEST_UPDATE: '/student/request_update_permission/',
  NOTIFICATIONS: '/student/my_notifications/',
  MARK_NOTIFICATION_READ: (id) => `/student/${id}/mark_notification_read/`,
  MARK_ALL_NOTIFICATIONS_READ: '/student/mark_all_notifications_read/',
  CAREER_PATH: '/student/my_career_path/',
  ASSESSMENTS: '/student/my_assessments/'
};

// Assessment endpoints
export const ASSESSMENT_ENDPOINTS = {
  DETAILS: (id) => `/assessments/${id}/`,
  SUBMIT: (id) => `/assessments/${id}/submit/`
};

// Curriculum endpoints
export const CURRICULUM_ENDPOINTS = {
  LIST: '/curriculum/',
  DETAILS: (id) => `/curriculum/${id}/`
};

// Default headers for API requests
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Config object for axios requests
export const getRequestConfig = (customHeaders = {}) => {
  return {
    headers: {
      ...getDefaultHeaders(),
      ...customHeaders
    }
  };
};

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  STUDENT_ENDPOINTS,
  ASSESSMENT_ENDPOINTS,
  CURRICULUM_ENDPOINTS,
  getDefaultHeaders,
  getRequestConfig
};