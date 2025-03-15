// src/components/dashboard/ProfileCompletionAlert.jsx
import React from 'react';
import { Alert, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  profileCompletionAlert: {
    marginBottom: '24px',
  },
});

const ProfileCompletionAlert = ({ profileCompletion }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // If profile is complete, don't show any alert
  if (!profileCompletion || profileCompletion.complete) {
    return null;
  }

  return (
    <Alert 
      severity="warning" 
      className={classes.profileCompletionAlert}
      action={
        <Button 
          color="inherit" 
          size="small" 
          onClick={() => navigate('/profile')}
        >
          Complete Profile
        </Button>
      }
    >
      Your profile is {profileCompletion.percentage}% complete. Please complete your profile to access all features.
    </Alert>
  );
};

export default ProfileCompletionAlert;