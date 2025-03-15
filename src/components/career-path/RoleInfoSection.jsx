// src/components/career-path/RoleInfoSection.jsx
import React from 'react';
import { Grid, Box, Typography, Paper, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Code as CodeIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import RoleProgress from './RoleProgress';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  roleContainer: {
    textAlign: 'center',
    padding: '24px',
  },
  roleIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#7E57C2',
  },
  roleName: {
    fontWeight: '600',
    marginBottom: '8px',
  },
});

// Map role names to icons
const getRoleIcon = (role) => {
  const roleIcons = {
    'software_developer': <CodeIcon />,
    'web_developer': <LanguageIcon />,
    'data_scientist': <StorageIcon />,
    'cybersecurity_analyst': <SecurityIcon />,
    // Add more role mappings as needed
  };
  
  return roleIcons[role] || <SchoolIcon />;
};

// Format role name for display
const formatRoleName = (role) => {
  if (!role) return '';
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const RoleInfoSection = ({ preferredRole }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box className={classes.roleContainer}>
            <Box className={classes.roleIcon}>
              {getRoleIcon(preferredRole)}
            </Box>
            <Typography variant="h5" className={classes.roleName}>
              {formatRoleName(preferredRole)}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Your chosen career path
            </Typography>
            <Chip 
              label="In Progress" 
              color="primary" 
              variant="outlined" 
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <RoleProgress />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RoleInfoSection;