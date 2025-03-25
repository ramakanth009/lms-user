// src/components/profile/UpdatePermissionSection.jsx
import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Lock as LockIcon } from '@mui/icons-material';

const useStyles = makeStyles({
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
  lockInfo: {
    marginTop: '8px',
    color: '#666',
    fontSize: '0.875rem',
  },
});

const UpdatePermissionSection = ({ canUpdateProfile }) => {
  const classes = useStyles();

  // If user can update profile, don't show this section
  if (canUpdateProfile) {
    return null;
  }

  return (
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
  );
};

export default UpdatePermissionSection;