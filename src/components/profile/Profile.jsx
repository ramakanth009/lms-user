// src/components/profile/Profile.jsx (Updated with helper and validator utilities)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  Chip,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import ProfileUpdate from './ProfileUpdate';
// Import helper and validator utilities
import { formatDate, getInitials, formatRoleName } from '../../utils/helper';
import { validateSchema, updateRequestValidationSchema } from '../../utils/validator';
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
  avatar: {
    width: '120px',
    height: '120px',
    margin: '0 auto 16px',
    backgroundColor: '#7E57C2',
    fontSize: '40px',
  },
  profileHeader: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  username: {
    fontWeight: '600',
    marginTop: '8px',
  },
  email: {
    color: '#666',
  },
  profileSection: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '8px',
      color: '#7E57C2',
    },
  },
  profileDetail: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  profileDetailIcon: {
    marginRight: '16px',
    marginTop: '4px',
    color: '#7E57C2',
  },
  profileDetailContent: {
    flex: 1,
  },
  profileDetailLabel: {
    color: '#666',
    marginBottom: '4px',
  },
  profileDetailValue: {
    fontWeight: '500',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  editButton: {
    marginTop: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  progressCard: {
    padding: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  progressContainer: {
    position: 'relative',
    display: 'inline-flex',
    marginBottom: '16px',
  },
  progressValue: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  progressLabel: {
    fontWeight: '500',
  },
  updateRequestContainer: {
    padding: '16px',
    backgroundColor: '#f5f7fa',
    borderRadius: '8px',
    marginTop: '24px',
    border: '1px dashed #ccc',
  },
  lockIcon: {
    marginRight: '8px',
    color: '#f44336',
  },
  noUpdateText: {
    color: '#666',
  },
  unlockMessageField: {
    marginTop: '16px',
  },
  lockInfo: {
    marginTop: '8px',
    color: '#666',
    fontSize: '0.875rem',
  },
  assessmentsContainer: {
    marginTop: '16px',
  },
  assessmentItem: {
    marginBottom: '8px',
    padding: '12px',
    backgroundColor: '#f9f9fc',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  assessmentTitle: {
    fontWeight: '500',
  },
  assessmentScore: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  skillsContainer: {
    marginTop: '8px',
  },
});

const Profile = () => {
  const classes = useStyles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [requestUpdateOpen, setRequestUpdateOpen] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
        
        // In a real app, we would use an endpoint to fetch the profile
        // For demonstration purposes, we'll mock some data
        setTimeout(() => {
          // Mock response data based on API documentation structure
          const mockData = {
            status: 'success',
            data: {
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
            }
          };
          
          setProfile(mockData.data);
          // Store user data in storage service
          StorageService.storage.local.set('userData', {
            email: mockData.data.user_email,
            studentId: mockData.data.student_id,
            role: mockData.data.preferred_role
          });
          
          setError(null);
          setLoading(false);
        }, 1000);
        
        // In a real app, we would use:
        /*
        const response = await axios.get('http://localhost:8000/api/student/my_profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
        */
        
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

  const handleRequestUpdateClose = () => {
    setRequestUpdateOpen(false);
    setRequestReason('');
  };

  const handleSubmitRequest = async () => {
    // Validate the request reason
    const validationResult = validateSchema(
      { reason: requestReason },
      updateRequestValidationSchema
    );
    
    if (!validationResult.isValid) {
      setSnackbar({
        open: true,
        message: validationResult.errors.reason || 'Please provide a valid reason for your request',
        severity: 'error',
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // In a real app, we would send the request to the server
      /*
      const response = await axios.post(
        'http://localhost:8000/api/student/request_update_permission/',
        { reason: requestReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      */
      
      // Mock successful request for demonstration
      setTimeout(() => {
        setSubmitting(false);
        setRequestUpdateOpen(false);
        setRequestReason('');
        setSnackbar({
          open: true,
          message: 'Update request submitted successfully',
          severity: 'success',
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting update request:', error);
      setSubmitting(false);
      setSnackbar({
        open: true,
        message: 'Failed to submit update request. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

  const handleCancelEdit = () => {
    setEditMode(false);
  };

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
          <Button 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setEditMode(true)}
          >
            Create Profile
          </Button>
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
        onCancel={handleCancelEdit}
      />
    );
  }

  // Extract first letter of email for avatar using helper function
  const avatarLetter = getInitials(profile.user_email);

  // Split skills string into an array
  const skillsArray = profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : [];

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          My Profile
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Box className={classes.profileHeader}>
              <Avatar className={classes.avatar}>
                {avatarLetter}
              </Avatar>
              <Typography variant="h5" className={classes.username}>
                {profile.student_id}
              </Typography>
              <Typography variant="body1" className={classes.email}>
                {profile.user_email}
              </Typography>
              <Chip 
                label={formatRoleName(profile.preferred_role)} 
                color="primary" 
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider />
            
            <Box className={classes.profileSection}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <PersonIcon /> Personal Information
              </Typography>
              
              <Box className={classes.profileDetail}>
                <PhoneIcon className={classes.profileDetailIcon} />
                <Box className={classes.profileDetailContent}>
                  <Typography variant="body2" className={classes.profileDetailLabel}>
                    Phone Number
                  </Typography>
                  <Typography variant="body1" className={classes.profileDetailValue}>
                    {profile.phone}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.profileDetail}>
                <EmailIcon className={classes.profileDetailIcon} />
                <Box className={classes.profileDetailContent}>
                  <Typography variant="body2" className={classes.profileDetailLabel}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" className={classes.profileDetailValue}>
                    {profile.user_email}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.profileDetail}>
                <SchoolIcon className={classes.profileDetailIcon} />
                <Box className={classes.profileDetailContent}>
                  <Typography variant="body2" className={classes.profileDetailLabel}>
                    Department
                  </Typography>
                  <Typography variant="body1" className={classes.profileDetailValue}>
                    {profile.department}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.profileDetail}>
                <CakeIcon className={classes.profileDetailIcon} />
                <Box className={classes.profileDetailContent}>
                  <Typography variant="body2" className={classes.profileDetailLabel}>
                    Batch
                  </Typography>
                  <Typography variant="body1" className={classes.profileDetailValue}>
                    {profile.batch}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              fullWidth
              className={classes.editButton}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
            
            {!profile.can_update_profile && (
              <Box className={classes.updateRequestContainer}>
                <Box display="flex" alignItems="center">
                  <LockIcon className={classes.lockIcon} />
                  <Typography variant="body2" className={classes.noUpdateText}>
                    Profile updates are locked
                  </Typography>
                </Box>
                <Typography variant="body2" className={classes.lockInfo}>
                  You need admin approval to update your profile. Click the "Edit Profile" button to request permission.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <BarChartIcon /> Academic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper className={classes.progressCard} elevation={0} variant="outlined">
                  <Box className={classes.progressContainer}>
                    <CircularProgress
                      variant="determinate"
                      value={profile.role_progress || 0}
                      size={80}
                      thickness={5}
                      sx={{ color: '#7E57C2' }}
                    />
                    <Box className={classes.progressValue}>
                      {`${Math.round(profile.role_progress || 0)}%`}
                    </Box>
                  </Box>
                  <Typography className={classes.progressLabel}>
                    Career Progress
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper className={classes.progressCard} elevation={0} variant="outlined">
                  <Box className={classes.progressContainer}>
                    <CircularProgress
                      variant="determinate"
                      value={profile.current_cgpa ? (profile.current_cgpa / 10) * 100 : 0}
                      size={80}
                      thickness={5}
                      sx={{ color: '#4caf50' }}
                    />
                    <Box className={classes.progressValue}>
                      {profile.current_cgpa || 0}
                    </Box>
                  </Box>
                  <Typography className={classes.progressLabel}>
                    Current CGPA
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper className={classes.progressCard} elevation={0} variant="outlined">
                  <Box className={classes.progressContainer}>
                    <CircularProgress
                      variant="determinate"
                      value={profile.completed_assessments ? (profile.completed_assessments / (profile.completed_assessments + 2)) * 100 : 0}
                      size={80}
                      thickness={5}
                      sx={{ color: '#f44336' }}
                    />
                    <Box className={classes.progressValue}>
                      {profile.completed_assessments || 0}
                    </Box>
                  </Box>
                  <Typography className={classes.progressLabel}>
                    Completed Assessments
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box mt={4}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <SchoolIcon /> Skills & Expertise
              </Typography>
              
              <Box className={classes.skillsContainer}>
                {skillsArray.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    className={classes.chip}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            <Box mt={4}>
              <Typography variant="h6" className={classes.sectionTitle}>
                Profile Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box className={classes.profileDetail}>
                    <Box className={classes.profileDetailContent}>
                      <Typography variant="body2" className={classes.profileDetailLabel}>
                        Profile Created On
                      </Typography>
                      <Typography variant="body1" className={classes.profileDetailValue}>
                        {formatDate(profile.profile_completion_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box className={classes.profileDetail}>
                    <Box className={classes.profileDetailContent}>
                      <Typography variant="body2" className={classes.profileDetailLabel}>
                        Last Updated
                      </Typography>
                      <Typography variant="body1" className={classes.profileDetailValue}>
                        {formatDate(profile.last_update_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box className={classes.profileDetail}>
                    <Box className={classes.profileDetailContent}>
                      <Typography variant="body2" className={classes.profileDetailLabel}>
                        Student ID
                      </Typography>
                      <Typography variant="body1" className={classes.profileDetailValue}>
                        {profile.student_id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box className={classes.profileDetail}>
                    <Box className={classes.profileDetailContent}>
                      <Typography variant="body2" className={classes.profileDetailLabel}>
                        Graduation Year
                      </Typography>
                      <Typography variant="body1" className={classes.profileDetailValue}>
                        {profile.graduation_year}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Request update permission dialog */}
      <Dialog 
        open={requestUpdateOpen} 
        onClose={handleRequestUpdateClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Request Profile Update Permission</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Your profile is currently locked for updates. Please provide a reason why you need to update your profile.
          </Typography>
          <TextField
            label="Reason for Update"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            placeholder="Example: I need to update my CGPA and phone number."
            className={classes.unlockMessageField}
            required
            error={requestReason.length > 0 && requestReason.length < 10}
            helperText={requestReason.length > 0 && requestReason.length < 10 ? 
              "Reason must be at least 10 characters" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleRequestUpdateClose} 
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRequest} 
            variant="contained" 
            color="primary"
            disabled={submitting || requestReason.length < 10}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
      
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