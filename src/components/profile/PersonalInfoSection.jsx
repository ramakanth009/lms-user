// src/components/profile/PersonalInfoSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { makeStyles } from "@mui/styles";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  profileSection: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '16px !important',
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
});

const PersonalInfoSection = ({ profile }) => {
  const classes = useStyles();
  
  // Extract personal info
  const { 
    phone,
    user_email,
    department,
    batch,
    username,
    student_id
  } = profile || {};

  return (
    <Box className={classes.profileSection}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <PersonIcon /> Personal Information
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box className={classes.profileDetail}>
        <BadgeIcon className={classes.profileDetailIcon} />
        <Box className={classes.profileDetailContent}>
          <Typography variant="body2" className={classes.profileDetailLabel}>
            Full Name
          </Typography>
          <Typography variant="body1" className={classes.profileDetailValue}>
            {username || 'Not specified'}
          </Typography>
        </Box>
      </Box>
      
      <Box className={classes.profileDetail}>
        <PersonIcon className={classes.profileDetailIcon} />
        <Box className={classes.profileDetailContent}>
          <Typography variant="body2" className={classes.profileDetailLabel}>
            Student ID
          </Typography>
          <Typography variant="body1" className={classes.profileDetailValue}>
            {student_id || 'Not specified'}
          </Typography>
        </Box>
      </Box>
      
      <Box className={classes.profileDetail}>
        <PhoneIcon className={classes.profileDetailIcon} />
        <Box className={classes.profileDetailContent}>
          <Typography variant="body2" className={classes.profileDetailLabel}>
            Phone Number
          </Typography>
          <Typography variant="body1" className={classes.profileDetailValue}>
            {phone || 'Not specified'}
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
            {user_email || 'Not specified'}
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
            {department || 'Not specified'}
          </Typography>
        </Box>
      </Box>
      
      <Box className={classes.profileDetail}>
        <TimelineIcon className={classes.profileDetailIcon} />
        <Box className={classes.profileDetailContent}>
          <Typography variant="body2" className={classes.profileDetailLabel}>
            Batch
          </Typography>
          <Typography variant="body1" className={classes.profileDetailValue}>
            {batch || 'Not specified'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInfoSection;