import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ProfileCompletionPopup from './ProfileCompletionPopup';
import axios from 'axios';

const ProfilePopupManager = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [adminApproved, setAdminApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If user is authenticated, check profile status
    if (isAuthenticated) {
      checkProfileStatus();
    }
  }, [isAuthenticated]);
  
  const checkProfileStatus = async () => {
    try {
      setLoading(true);
      
      // Check if this is a new login by looking at a session flag
      const isNewLogin = sessionStorage.getItem('isNewLogin') === 'true';
      
      if (isNewLogin) {
        // Get profile data from API
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/student/my_profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data && response.data.data) {
          const profile = response.data.data;
          setProfileData(profile);
          
          // Check if admin has approved an update request
          const adminApproved = profile.can_update_profile || false;
          setAdminApproved(adminApproved);
          
          // Check if profile is complete
          const isComplete = checkProfileCompleteness(profile);
          
          // If profile is incomplete and this is a new login, show popup
          // OR if admin has approved an update and this is a new login, also show popup
          if ((!isComplete || adminApproved) && isNewLogin) {
            setIsFirstLogin(!isComplete);
            setShowPopup(true);
          }
        } else {
          // If no profile data, assume it's a first login
          setIsFirstLogin(true);
          setShowPopup(true);
        }
        
        // Clear the new login flag
        sessionStorage.removeItem('isNewLogin');
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      // If API fails and it's a new login, show popup as a fallback
      const isNewLogin = sessionStorage.getItem('isNewLogin') === 'true';
      if (isNewLogin) {
        setIsFirstLogin(true);
        setShowPopup(true);
        sessionStorage.removeItem('isNewLogin');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Check if profile is complete
  const checkProfileCompleteness = (profile) => {
    return !!(
      profile &&
      profile.phone &&
      profile.department &&
      profile.preferred_role &&
      profile.batch &&
      profile.student_id &&
      profile.skills
    );
  };
  
  const handlePopupClose = (success) => {
    setShowPopup(false);
    
    // If profile was successfully completed/updated
    if (success) {
      // Refresh profile data
      checkProfileStatus();
    }
  };
  
  // Don't render anything while loading
  if (loading) return null;
  
  // Only render popup if needed
  return (
    <>
      {showPopup && (
        <ProfileCompletionPopup 
          open={showPopup}
          onClose={handlePopupClose}
          isFirstLogin={isFirstLogin}
          adminApproved={adminApproved}
          profileData={profileData}
        />
      )}
    </>
  );
};

export default ProfilePopupManager;