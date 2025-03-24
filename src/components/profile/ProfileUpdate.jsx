// src/components/profile/ProfileUpdate.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
// Import the validator utilities
import { validateSchema, profileValidationSchema } from '../../utils/validator';

const useStyles = makeStyles({
  root: {
    padding: isPopup => isPopup ? '0' : '16px',
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
  formControl: {
    marginBottom: '24px',
  },
  fieldLabel: {
    marginBottom: '8px',
    fontWeight: '500',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
    gap: '16px',
  },
  cancelButton: {
    marginRight: '16px',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  chip: {
    margin: '0 8px 8px 0',
  },
  newSkillContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  newSkillField: {
    flex: 1,
    marginRight: '8px',
  },
  fieldContainer: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '20px',
    marginTop: '24px',
  },
  infoAlert: {
    marginBottom: '24px',
  },
  readOnlyField: {
    backgroundColor: '#f5f5f5',
  },
});

const ProfileUpdate = ({ profile, onSuccess, onCancel, isPopup = false }) => {
  const classes = useStyles(isPopup);
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    department: profile?.department || '',
    preferred_role: profile?.preferred_role || '',
    batch: profile?.batch || '',
    student_id: profile?.student_id || '',
    current_cgpa: profile?.current_cgpa || '',
    skills: profile?.skills || '',
  });
  
  const [skillsList, setSkillsList] = useState(
    profile?.skills ? profile.skills.split(',').map(skill => skill.trim()) : []
  );
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Updated to use the validation utility
  const validateForm = () => {
    // Create a temporary object with form data and skills
    const dataToValidate = {
      ...formData,
      skills: skillsList.length > 0 ? 'valid' : '' // Just needs to be non-empty for validation
    };
    
    // Use the validation schema utility
    const validationResult = validateSchema(dataToValidate, profileValidationSchema);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Combine skills list into a comma-separated string
      const updatedFormData = {
        ...formData,
        skills: skillsList.join(', '),
      };
      
      // If in popup mode, simply call the success handler with form data
      if (isPopup) {
        if (onSuccess) {
          onSuccess(updatedFormData);
        }
        return;
      }
      
      // Regular mode - make the API call directly
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        'http://localhost:8000/api/student/update_profile/',
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data) {
        // Create an updated profile object with the new data
        const updatedProfile = {
          ...profile,
          ...response.data.data,
          last_update_date: new Date().toISOString(),
          can_update_profile: false, // Profile will be locked after update
        };
        
        // Call the success callback with the updated profile
        if (onSuccess) {
          onSuccess(updatedProfile);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSubmitError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={classes.root}>
      {!isPopup && (
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Update Profile
          </Typography>
        </Box>
      )}
      
      <Paper className={isPopup ? '' : classes.paper}>
        {!isPopup && (
          <Alert severity="info" className={classes.infoAlert}>
            You can update your profile information below. After updating, your profile will be locked again and you will need to request permission for further updates.
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={profile?.user_email || ''}
                  disabled
                  variant="outlined"
                  InputProps={{
                    className: classes.readOnlyField,
                  }}
                />
              </Box>
              
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Phone Number*
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="+1234567890"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={submitting}
                  required
                />
              </Box>
              
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Student ID*
                </Typography>
                <TextField
                  fullWidth
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.student_id}
                  helperText={errors.student_id}
                  disabled={submitting || (profile && profile.id && !isPopup)} // Disable if editing existing profile
                  required
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Department*
                </Typography>
                <FormControl fullWidth variant="outlined" error={!!errors.department}>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={submitting || (profile && profile.id && !isPopup)} // Disable if editing existing profile
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Department
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department && (
                    <Typography color="error" variant="caption">
                      {errors.department}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Batch*
                </Typography>
                <TextField
                  fullWidth
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="2020-2024"
                  error={!!errors.batch}
                  helperText={errors.batch || 'Format: YYYY-YYYY'}
                  disabled={submitting || (profile && profile.id && !isPopup)} // Disable if editing existing profile
                  required
                />
              </Box>
              
              <Box className={classes.fieldContainer}>
                <Typography variant="body2" className={classes.fieldLabel}>
                  Current CGPA
                </Typography>
                <TextField
                  fullWidth
                  name="current_cgpa"
                  value={formData.current_cgpa}
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 10 }}
                  error={!!errors.current_cgpa}
                  helperText={errors.current_cgpa}
                  disabled={submitting}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Typography variant="h6" className={classes.sectionTitle}>
            Career Information
          </Typography>
          
          <Box className={classes.fieldContainer}>
            <Typography variant="body2" className={classes.fieldLabel}>
              Preferred Role*
            </Typography>
            <FormControl fullWidth variant="outlined" error={!!errors.preferred_role}>
              <Select
                name="preferred_role"
                value={formData.preferred_role}
                onChange={handleChange}
                disabled={submitting || (profile && profile.id && !isPopup)} // Disable if editing existing profile
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Preferred Role
                </MenuItem>
                {availableRoles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.preferred_role && (
                <Typography color="error" variant="caption">
                  {errors.preferred_role}
                </Typography>
              )}
            </FormControl>
          </Box>
          
          <Box className={classes.fieldContainer}>
            <Typography variant="body2" className={classes.fieldLabel}>
              Skills*
            </Typography>
            <Typography variant="caption" color="textSecondary" paragraph>
              Add skills related to your preferred role and career goals.
            </Typography>
            
            <Box className={classes.chipContainer}>
              {skillsList.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                  disabled={submitting}
                />
              ))}
            </Box>
            
            <Box className={classes.newSkillContainer}>
              <TextField
                className={classes.newSkillField}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill (e.g., Python, JavaScript)"
                variant="outlined"
                size="small"
                disabled={submitting}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSkill}
                startIcon={<AddIcon />}
                disabled={!newSkill.trim() || submitting}
              >
                Add
              </Button>
            </Box>
            
            {errors.skills && (
              <Typography color="error" variant="caption">
                {errors.skills}
              </Typography>
            )}
          </Box>
          
          {submitError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box className={classes.buttonContainer}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              startIcon={<CancelIcon />}
              className={classes.cancelButton}
              disabled={submitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isPopup ? 'Continue' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileUpdate;