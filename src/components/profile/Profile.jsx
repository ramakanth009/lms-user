// src/components/profile/Profile.jsx
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

// Import subcomponents
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import UpdatePermissionSection from './UpdatePermissionSection';
import AcademicMetrics from './AcademicMetrics';
import SkillsSection from './SkillsSection';
import ProfileInformationSection from './ProfileInformationSection';
import RequestUpdateDialog from './RequestUpdateDialog';
import ProfileUpdate from './ProfileUpdate';

// Import helper utilities
import StorageService from '../../services/storage';

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
        
        // In a real app, use the API endpoint
        try {
          // Uncomment for actual API usage
          /*
          const response = await axios.get('http://localhost:8000/api/student/my_profile/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data.data);
          */
          
          // Mock data for demonstration
          setTimeout(() => {
            const mockData = {
              id: 27,
              user_email: 'student@example.com',
              department: 'Information Technology',
              preferred_role: 'software_developer',
              batch: '2020-2024',
              student_id: 'ABCDEF121',
              phone: '+1234567890',
              current_cgpa: 3.5,
              skills: 'Python, Java, Web Development',
              graduation_year: 2024,
              role_progress: 45.0,
              completed_curriculum: 2,
              completed_assessments: 1,
              profile_completion_date: '2025-03-11T06:04:45.907606Z',
              last_update_date: '2025-03-11T06:27:33.569285Z',
              can_update_profile: false // Assuming profile updates are locked
            };
            
            setProfile(mockData);
            
            // Store user data in storage service
            StorageService.storage.local.set('userData', {
              email: mockData.user_email,
              studentId: mockData.student_id,
              role: mockData.preferred_role
            });
            
            setError(null);
            setLoading(false);
          }, 1000);
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again later.');
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

  const handleRequestUpdateSuccess = (response) => {
    setSnackbar({
      open: true,
      message: 'Update request submitted successfully',
      severity: 'success',
    });
  };

  const handleProfileUpdateSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    setEditMode(false);
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