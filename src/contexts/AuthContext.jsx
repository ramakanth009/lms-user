// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: true,
    shouldShowPopup: false,
    adminApproved: false,
    profileData: null
  });

  useEffect(() => {
    // Check if user is authenticated on mount and set up API interceptors
    const checkAuth = async () => {
      try {
        const auth = AuthService.getCurrentUser();
        setIsAuthenticated(auth.isAuthenticated);
        
        // Set up axios interceptors for token refresh
        AuthService.setupAxiosInterceptors();
        
        // If authenticated, check profile status
        if (auth.isAuthenticated) {
          await checkProfileStatus();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated]);

  // Function to check profile status
  const checkProfileStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Check if this is a new login by looking at a session flag
      const isNewLogin = sessionStorage.getItem('isNewLogin') === 'true';
      
      // Make API call to get profile status
      const response = await axios.get('http://localhost:8000/api/student/my_profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const profileData = response.data;
      
      // If admin has approved an update, there will be a flag in the response
      const adminApproved = profileData?.can_update_profile || false;
      
      // Check if profile exists and is complete
      const isComplete = !!profileData && (
        profileData.username &&
        profileData.phone && 
        profileData.department && 
        profileData.preferred_role && 
        profileData.batch && 
        profileData.student_id && 
        profileData.skills
      );
      
      // Determine if popup should be shown:
      // 1. If profile is incomplete and this is a new login
      // 2. If admin has approved an update and this is a new login
      const shouldShowPopup = (
        isNewLogin && (!isComplete || adminApproved)
      );
      
      setProfileStatus({
        isComplete,
        shouldShowPopup,
        adminApproved,
        profileData
      });
      
      // Clear the new login flag
      sessionStorage.removeItem('isNewLogin');
      
      // Set user data
      setUser({
        email: profileData?.user_email,
        studentId: profileData?.student_id,
        name: profileData?.username || profileData?.student_id || profileData?.user_email
      });
      
    } catch (error) {
      console.error('Error checking profile status:', error);
      
      // If API fails, assume profile is incomplete
      setProfileStatus({
        isComplete: false,
        shouldShowPopup: true,
        adminApproved: false,
        profileData: null
      });
    }
  };

  // Create login handler with new login flag
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await AuthService.login(email, password, rememberMe);
      setIsAuthenticated(true);
      
      // Set a flag in session storage to indicate this is a new login
      sessionStorage.setItem('isNewLogin', 'true');
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, error };
    }
  };

  // Create logout handler
  const logout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setProfileStatus({
        isComplete: true,
        shouldShowPopup: false,
        adminApproved: false,
        profileData: null
      });
      return { success: true };
    } catch (error) {
      console.error('Logout error in context:', error);
      // Even on error, we still want to clear the auth state
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error };
    }
  };

  // Handler for updating profile status after completion
  const updateProfileStatus = (isComplete = true, data = null) => {
    setProfileStatus(prev => ({
      ...prev,
      isComplete,
      shouldShowPopup: false,
      profileData: data || prev.profileData
    }));
    
    if (data) {
      setUser({
        email: data.user_email,
        studentId: data.student_id,
        name: data.username || data.student_id || data.user_email
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      loading, 
      user, 
      setUser,
      profileStatus,
      updateProfileStatus,
      login,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;