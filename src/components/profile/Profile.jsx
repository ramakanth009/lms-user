// src/components/profile/Profile.jsx
import React, { useState, useEffect, useContext } from 'react';
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

// Import subcomponents
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import UpdatePermissionSection from './UpdatePermissionSection';
import AcademicMetrics from './AcademicMetrics';
import SkillsSection from './SkillsSection';
import ProfileInformationSection from './ProfileInformationSection';
import RequestUpdateDialog from './RequestUpdateDialog';
import ProfileUpdate from './ProfileUpdate';

// Import context
import { AuthContext } from '../../contexts/AuthContext';

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
  const { profileStatus, updateProfileStatus } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [requestUpdateOpen, setRequestUpdateOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch profile data
  useEffect(() => {
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
        
        setProfile(response.data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    // Check if the user can update their profile
    if (profile && profile.can_update_profile) {
      setEditMode(true);
    } else {
      // Show dialog to request update permission
      setRequestUpdateOpen(true);
    }
  };

  const handleRequestUpdateSuccess = async (response) => {
    setSnackbar({
      open: true,
      message: 'Update request submitted successfully. You will be notified when approved.',
      severity: 'success',
    });
    
    // Close the request dialog
    setRequestUpdateOpen(false);
  };

  const handleProfileUpdateSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    setEditMode(false);
    
    // Update the profile status in AuthContext
    updateProfileStatus(true, updatedProfile);
    
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success',
    });
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

  // If in edit mode, show the profile update form
  if (editMode) {
    return (
      <ProfileUpdate 
        profile={profile} 
        onSuccess={handleProfileUpdateSuccess} 
        onCancel={() => setEditMode(false)}
      />
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
              onEditClick={handleEditClick} 
            />
            
            <PersonalInfoSection profile={profile} />
            
            {/* Profile Update Request Information */}
            <UpdatePermissionSection canUpdateProfile={profile.can_update_profile} />
          </Paper>
        </Grid>
        
        {/* Right Column - Academic and Skills Information */}
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Academic Information
            </Typography>
            
            {/* Academic Metrics */}
            <AcademicMetrics profile={profile} />
            
            {/* Skills Section */}
            <SkillsSection skills={profile.skills} />
            
            {/* Profile Information */}
            <ProfileInformationSection profile={profile} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Request Update Dialog */}
      <RequestUpdateDialog 
        open={requestUpdateOpen}
        onClose={() => setRequestUpdateOpen(false)}
        onSuccess={handleRequestUpdateSuccess}
      />
      
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