import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Cake as CakeIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import EditableProfileField from './EditableProfileField';
import axios from 'axios';

const useStyles = makeStyles({
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
  infoContainer: {
    marginBottom: '16px',
  }
});

const PersonalInfoSection = ({ 
  profile, 
  canUpdateProfile = false,
  onProfileUpdated = () => {}
}) => {
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // List of available roles to select from
  const availableRoles = [
    { value: 'software_developer', label: 'Software Developer' },
    { value: 'data_scientist', label: 'Data Scientist' },
    { value: 'network_engineer', label: 'Network Engineer' },
    { value: 'web_developer', label: 'Web Developer' },
    { value: 'mobile_app_developer', label: 'Mobile App Developer' },
    { value: 'devops_engineer', label: 'DevOps Engineer' },
    { value: 'cloud_engineer', label: 'Cloud Engineer' },
    { value: 'cybersecurity_analyst', label: 'Cybersecurity Analyst' },
    { value: 'database_admin', label: 'Database Administrator' },
    { value: 'ml_engineer', label: 'Machine Learning Engineer' },
    { value: 'ui_ux_designer', label: 'UI/UX Designer' },
    { value: 'sql_developer', label: 'SQL Developer' },
  ];

  // List of departments
  const departments = [
    'Information Technology',
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electronics and Communication',
    'Data Science',
  ];
  
  // Handle field save (update via API)
  const handleFieldSave = async (fieldName, fieldValue) => {
    // Don't update if value hasn't changed
    if (profile[fieldName] === fieldValue) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Only fields that can be updated
      const updateableFields = [
        'phone', 
        'current_cgpa', 
        'skills'
      ];
      
      // Check if field is updateable
      if (!updateableFields.includes(fieldName)) {
        setSnackbar({
          open: true,
          message: `${fieldName} cannot be updated directly.`,
          severity: 'warning'
        });
        return;
      }
      
      // Create payload with only the changed field
      const payload = {
        [fieldName]: fieldValue
      };
      
      // Make sure we maintain any other required fields
      updateableFields.forEach(field => {
        if (field !== fieldName && profile[field]) {
          payload[field] = profile[field];
        }
      });
      
      // Add required fields
      if (profile.department) payload.department = profile.department;
      if (profile.preferred_role) payload.preferred_role = profile.preferred_role;
      if (profile.batch) payload.batch = profile.batch;
      if (profile.student_id) payload.student_id = profile.student_id;
      
      // Make API call
      const response = await axios.put(
        'http://localhost:8000/api/student/update_profile/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.data) {
        // Call callback function with updated profile
        onProfileUpdated(response.data.data);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `${fieldName} updated successfully!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating field:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update field. Please try again.',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Format role name for display
  const formatRoleName = (roleName) => {
    if (!roleName) return '';
    
    // Find the role in our options
    const role = availableRoles.find(r => r.value === roleName);
    if (role) return role.label;
    
    // Otherwise format it from the snake case
    return roleName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Box className={classes.profileSection}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <PersonIcon /> Personal Information
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Phone Number"
              name="phone"
              value={profile?.phone}
              required={true}
              canEdit={canUpdateProfile}
              onSave={handleFieldSave}
            />
          </Box>
          
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Email Address"
              name="user_email"
              value={profile?.user_email}
              disabled={true}
              editable={false}
            />
          </Box>
          
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Current CGPA"
              name="current_cgpa"
              value={profile?.current_cgpa?.toString()}
              type="number"
              canEdit={canUpdateProfile}
              onSave={handleFieldSave}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Department"
              name="department"
              value={profile?.department}
              required={true}
              options={departments}
              editable={false}
              disabled={true}
            />
          </Box>
          
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Batch"
              name="batch"
              value={profile?.batch}
              required={true}
              editable={false}
              disabled={true}
            />
          </Box>
          
          <Box className={classes.infoContainer}>
            <EditableProfileField
              label="Preferred Role"
              name="preferred_role"
              value={formatRoleName(profile?.preferred_role)}
              required={true}
              editable={false}
              disabled={true}
            />
          </Box>
        </Grid>
      </Grid>
      
      <Box className={classes.infoContainer} mt={2}>
        <EditableProfileField
          label="Skills"
          name="skills"
          value={profile?.skills}
          required={true}
          canEdit={canUpdateProfile}
          onSave={handleFieldSave}
          multiline={true}
          rows={2}
          placeholder="No skills added yet"
        />
      </Box>
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalInfoSection;