import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Import updated components
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import ProfileUpdatePermission from './ProfileUpdatePermission';
import AcademicMetrics from './AcademicMetrics';
import SkillsSection from './SkillsSection';
import ProfileInformationSection from './ProfileInformationSection';

const useStyles = makeStyles({
  root: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
});

const Profile = () => {
  const classes = useStyles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [updatePermission, setUpdatePermission] = useState({
    canUpdate: false,
    timeRemaining: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Use real API endpoint
      const response = await axios.get('http://localhost:8000/api/student/my_profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        setProfile(response.data);
        
        // Check if user can update profile
        const canUpdate = response.data.can_update_profile || false;
        
        // If we have permission expiry data, calculate time remaining
        let timeRemaining = null;
        if (response.data.update_permission_expires_at) {
          const expiryDate = new Date(response.data.update_permission_expires_at);
          const now = new Date();
          const diffHours = Math.max(0, (expiryDate - now) / (1000 * 60 * 60));
          timeRemaining = diffHours;
        }
        
        setUpdatePermission({
          canUpdate,
          timeRemaining,
        });
        
        // Check if there's a pending request
        setHasPendingRequest(response.data.has_pending_update_request || false);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequested = (response) => {
    // Update pending request state
    setHasPendingRequest(true);
    
    setSnackbar({
      open: true,
      message: 'Update request submitted successfully. You will be notified when approved.',
      severity: 'success',
    });
  };

  const handleProfileUpdated = (updatedProfile) => {
    // Update the profile state with new data
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // If still loading profile data
  if (loading) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            My Profile
          </Typography>
        </Box>
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // If there was an error loading profile
  if (error) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            My Profile
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // If profile not found
  if (!profile) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            My Profile
          </Typography>
        </Box>
        <Paper className={classes.paper}>
          <Typography variant="h6">No profile found</Typography>
          <Typography variant="body1">
            Please create your profile to continue.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          My Profile
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Left Column - Personal Information */}
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            {/* Profile Header with Avatar and Basic Info */}
            <ProfileHeader 
              profile={profile} 
            />
            
            {/* Profile Update Permission Status */}
            <ProfileUpdatePermission 
              canUpdateProfile={updatePermission.canUpdate}
              hasPendingRequest={hasPendingRequest}
              onUpdateRequested={handleUpdateRequested}
              timeRemaining={updatePermission.timeRemaining}
            />
            
            {/* Personal Information Section */}
            <PersonalInfoSection 
              profile={profile}
              canUpdateProfile={updatePermission.canUpdate}
              onProfileUpdated={handleProfileUpdated}
            />
          </Paper>
        </Grid>
        
        {/* Right Column - Academic and Skills Information */}
        <Grid item xs={12} md={8}>
          {/* Academic Information Paper */}
          <Paper className={classes.paper}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Academic Information
            </Typography>
            
            {/* Academic Metrics */}
            <AcademicMetrics profile={profile} />
          </Paper>
          
          {/* Skills Paper */}
          <Paper className={classes.paper}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Skills & Expertise
            </Typography>
            
            {/* Skills Section */}
            <SkillsSection 
              skills={profile.skills} 
              canUpdateProfile={updatePermission.canUpdate}
              onProfileUpdated={handleProfileUpdated}
            />
          </Paper>
          
          {/* Profile Information Paper */}
          <Paper className={classes.paper}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Profile Information
            </Typography>
            
            {/* Profile Information */}
            <ProfileInformationSection profile={profile} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;