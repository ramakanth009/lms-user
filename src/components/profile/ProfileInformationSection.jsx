// src/components/profile/ProfileInformationSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '16px',
  },
  profileDetail: {
    marginBottom: '16px',
  },
  profileDetailLabel: {
    color: '#666',
    marginBottom: '4px',
  },
  profileDetailValue: {
    fontWeight: '500',
  },
});

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ProfileInformationSection = ({ profile }) => {
  const classes = useStyles();
  
  // Extract profile data
  const { 
    profile_completion_date,
    last_update_date,
    student_id,
    graduation_year,
  } = profile || {};

  return (
    <Box mt={4}>
      <Typography variant="h6" className={classes.sectionTitle}>
        Profile Information
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.profileDetail}>
            <Typography variant="body2" className={classes.profileDetailLabel}>
              Profile Created On
            </Typography>
            <Typography variant="body1" className={classes.profileDetailValue}>
              {formatDate(profile_completion_date)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box className={classes.profileDetail}>
            <Typography variant="body2" className={classes.profileDetailLabel}>
              Last Updated
            </Typography>
            <Typography variant="body1" className={classes.profileDetailValue}>
              {formatDate(last_update_date)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box className={classes.profileDetail}>
            <Typography variant="body2" className={classes.profileDetailLabel}>
              Student ID
            </Typography>
            <Typography variant="body1" className={classes.profileDetailValue}>
              {student_id || 'Not specified'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box className={classes.profileDetail}>
            <Typography variant="body2" className={classes.profileDetailLabel}>
              Graduation Year
            </Typography>
            <Typography variant="body1" className={classes.profileDetailValue}>
              {graduation_year || 'Not specified'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileInformationSection;