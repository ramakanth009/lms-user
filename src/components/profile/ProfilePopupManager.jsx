// src/components/profile/ProfilePopupManager.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ProfileCompletionPopup from './ProfileCompletionPopup';

const ProfilePopupManager = () => {
  const { profileStatus, updateProfileStatus } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    // Check if popup should be shown
    if (profileStatus.shouldShowPopup) {
      setShowPopup(true);
    }
  }, [profileStatus]);
  
  const handlePopupClose = (success) => {
    setShowPopup(false);
    
    // If profile was successfully completed/updated
    if (success) {
      updateProfileStatus(true);
    }
  };
  
  return (
    <ProfileCompletionPopup 
      open={showPopup}
      onClose={handlePopupClose}
      isFirstLogin={!profileStatus.isComplete && !profileStatus.adminApproved}
      adminApproved={profileStatus.adminApproved}
      profileData={profileStatus.profileData}
    />
  );
};

export default ProfilePopupManager;