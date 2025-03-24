// src/components/profile/ProfileCompletionPopup.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ProfileUpdate from './ProfileUpdate';
import axios from 'axios';

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: '600px',
    maxWidth: '800px',
  },
  dialogTitle: {
    backgroundColor: '#7E57C2',
    color: 'white',
  },
  stepper: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  welcomeMessage: {
    marginBottom: '24px',
  },
});

const ProfileCompletionPopup = ({ 
  open, 
  onClose, 
  isFirstLogin = true, 
  adminApproved = false,
  profileData = null 
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define steps based on whether this is first login or an update
  const steps = isFirstLogin 
    ? ['Welcome', 'Complete Profile', 'Finished'] 
    : ['Update Profile', 'Finished'];

  const handleProfileSubmit = async (updatedProfile) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      const endpoint = isFirstLogin 
        ? 'http://localhost:8000/api/student/create_profile/'
        : 'http://localhost:8000/api/student/update_profile/';
      
      const response = await axios.post(
        endpoint,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data) {
        // Move to next step
        setActiveStep(prevStep => prevStep + 1);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    // Refresh the page or update state in parent component
    if (onClose) {
      onClose(true); // true indicates successful completion
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        // Only show welcome step for first login
        if (!isFirstLogin) {
          return (
            <ProfileUpdate 
              profile={profileData}
              onSuccess={handleProfileSubmit}
              onCancel={() => onClose(false)}
              isPopup={true}
            />
          );
        }
        
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome to Your Learning Portal!
            </Typography>
            <Typography variant="body1" className={classes.welcomeMessage}>
              Before you get started, we need some information to complete your profile. 
              This will help us customize your learning experience and track your progress.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setActiveStep(1)}
            >
              Let's Get Started
            </Button>
          </Box>
        );
        
      case 1:
        // If not first login, this is already handled in case 0
        if (!isFirstLogin) {
          return (
            <Box>
              <Typography variant="h5" gutterBottom>
                Profile Updated Successfully!
              </Typography>
              <Typography variant="body1">
                Your profile has been updated. You can now continue with your learning journey.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleFinish}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Box>
          );
        }
        
        return (
          <ProfileUpdate 
            profile={profileData}
            onSuccess={handleProfileSubmit}
            onCancel={() => onClose(false)}
            isPopup={true}
          />
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Profile Completed Successfully!
            </Typography>
            <Typography variant="body1">
              Your profile has been set up. You can now start your learning journey.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleFinish}
              sx={{ mt: 2 }}
            >
              Get Started
            </Button>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        // Only allow closing if not in the middle of profile creation/update
        if (activeStep === 0 || activeStep === steps.length - 1) {
          onClose(false);
        }
      }}
      disableEscapeKeyDown
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {isFirstLogin ? 'Complete Your Profile' : 'Update Your Profile'}
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionPopup;