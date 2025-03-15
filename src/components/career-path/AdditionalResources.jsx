// src/components/career-path/AdditionalResources.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assignment as AssignmentIcon,
  Construction as ConstructionIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import CurriculumCard from './CurriculumCard';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
});

const AdditionalResources = ({ preferredRole }) => {
  const classes = useStyles();
  
  // Format role name for display
  const formatRoleName = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>
        Additional Resources
      </Typography>
      <Typography variant="body1" paragraph>
        Enhance your skills with these recommended resources for becoming a {formatRoleName(preferredRole)}.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <CurriculumCard 
            title="Industry Certifications"
            description="Recommended certifications to boost your credentials in this field."
            icon={<AssignmentIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurriculumCard 
            title="Sample Projects"
            description="Build these projects to demonstrate your skills to potential employers."
            icon={<ConstructionIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CurriculumCard 
            title="Mentorship Program"
            description="Connect with industry professionals in your chosen career field."
            icon={<SchoolIcon />}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdditionalResources;