// src/components/profile/ProfileHeader.jsx
import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Edit as EditIcon } from '@mui/icons-material';

const useStyles = makeStyles({
  profileHeader: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    margin: '0 auto 16px',
    backgroundColor: '#7E57C2',
    fontSize: '40px',
  },
  username: {
    fontWeight: '600',
    marginTop: '8px',
  },
  email: {
    color: '#666',
  },
  editButton: {
    marginTop: '16px',
  },
});

// Helper function to get initials for avatar
const getInitials = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase();
};

// Helper function to format role name
const formatRoleName = (role) => {
  if (!role) return '';
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProfileHeader = ({ profile, onEditClick }) => {
  const classes = useStyles();
  
  // Extract profile data
  const { user_email, student_id, preferred_role } = profile || {};
  
  // Get initials for avatar
  const avatarLetter = getInitials(user_email);

  return (
    <Box className={classes.profileHeader}>
      <Avatar className={classes.avatar}>
        {avatarLetter}
      </Avatar>
      <Typography variant="h5" className={classes.username}>
        {student_id}
      </Typography>
      <Typography variant="body1" className={classes.email}>
        {user_email}
      </Typography>
      <Chip 
        label={formatRoleName(preferred_role)} 
        color="primary" 
        variant="outlined"
        sx={{ mt: 1 }}
      />
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<EditIcon />}
        fullWidth
        className={classes.editButton}
        onClick={onEditClick}
      >
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfileHeader;