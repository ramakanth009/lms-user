import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  form: {
    width: '100%',
  },
  formField: {
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '24px',
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
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: '24px',
  },
});

const ProfileUpdate = ({ profile, onSuccess, onCancel, isPopup = false }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form data from profile or with empty values
  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    department: profile?.department || '',
    preferred_role: profile?.preferred_role || '',
    batch: profile?.batch || '',
    student_id: profile?.student_id || '',
    current_cgpa: profile?.current_cgpa || '',
  });
  
  // Manage skills separately for better UX
  const [skillsList, setSkillsList] = useState(
    profile?.skills ? profile.skills.split(',').map(skill => skill.trim()).filter(Boolean) : []
  );
  const [newSkill, setNewSkill] = useState('');
  
  // Form validation errors
  const [errors, setErrors] = useState({});

  // List of available roles
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Handle Enter key in skills field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.preferred_role) newErrors.preferred_role = 'Preferred role is required';
    if (!formData.batch) newErrors.batch = 'Batch is required';
    if (!formData.student_id) newErrors.student_id = 'Student ID is required';
    
    // Skills validation
    if (skillsList.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    
    // Basic format validations
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (formData.batch && !/^\d{4}-\d{4}$/.test(formData.batch)) {
      newErrors.batch = 'Batch must be in format YYYY-YYYY';
    }
    
    if (formData.current_cgpa && (formData.current_cgpa < 0 || formData.current_cgpa > 10)) {
      newErrors.current_cgpa = 'CGPA must be between 0 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Combine skills list into a comma-separated string
    const updatedFormData = {
      ...formData,
      skills: skillsList.join(', '),
    };
    
    // Call the success callback with the form data
    // The parent component will handle the API call
    if (onSuccess) {
      onSuccess(updatedFormData);
    }
    
    setLoading(false);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h6" className={classes.sectionTitle}>
        Personal Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            className={classes.formField}
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={loading}
            placeholder="+1234567890"
          />
          
          <TextField
            className={classes.formField}
            label="Student ID"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            error={!!errors.student_id}
            helperText={errors.student_id}
            disabled={loading || (profile && profile.id && !isPopup)}
          />
          
          <TextField
            className={classes.formField}
            label="Current CGPA"
            name="current_cgpa"
            type="number"
            inputProps={{ step: 0.1, min: 0, max: 10 }}
            value={formData.current_cgpa}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.current_cgpa}
            helperText={errors.current_cgpa}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl 
            fullWidth 
            variant="outlined" 
            className={classes.formField}
            error={!!errors.department}
            disabled={loading || (profile && profile.id && !isPopup)}
            required
          >
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
            >
              <MenuItem value="">
                <em>Select a department</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <FormHelperText>{errors.department}</FormHelperText>
            )}
          </FormControl>
          
          <FormControl
            fullWidth
            variant="outlined"
            className={classes.formField}
            error={!!errors.preferred_role}
            disabled={loading || (profile && profile.id && !isPopup)}
            required
          >
            <InputLabel>Preferred Role</InputLabel>
            <Select
              name="preferred_role"
              value={formData.preferred_role}
              onChange={handleChange}
              label="Preferred Role"
            >
              <MenuItem value="">
                <em>Select a role</em>
              </MenuItem>
              {availableRoles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
            {errors.preferred_role && (
              <FormHelperText>{errors.preferred_role}</FormHelperText>
            )}
          </FormControl>
          
          <TextField
            className={classes.formField}
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            error={!!errors.batch}
            helperText={errors.batch || 'Format: YYYY-YYYY'}
            disabled={loading || (profile && profile.id && !isPopup)}
            placeholder="2020-2024"
          />
        </Grid>
      </Grid>
      
      <Typography variant="h6" className={classes.sectionTitle}>
        Skills
      </Typography>
      
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Add skills related to your preferred role and career goals
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
              disabled={loading}
            />
          ))}
          {skillsList.length === 0 && (
            <Typography variant="body2" color="textSecondary" fontStyle="italic">
              No skills added yet
            </Typography>
          )}
        </Box>
        
        <Box className={classes.newSkillContainer}>
          <TextField
            className={classes.newSkillField}
            placeholder="Add a skill (e.g., Python, JavaScript)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            disabled={loading}
            error={!!errors.skills}
            helperText={errors.skills}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleAddSkill}
                    edge="end"
                    disabled={!newSkill.trim() || loading}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      
      <Box className={classes.buttonContainer}>
        {onCancel && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Saving...' : isPopup ? 'Continue' : 'Save Changes'}
        </Button>
      </Box>
    </form>
  );
};

export default ProfileUpdate;