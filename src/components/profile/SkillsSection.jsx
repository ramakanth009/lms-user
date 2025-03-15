// src/components/profile/SkillsSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { School as SchoolIcon } from '@mui/icons-material';

const useStyles = makeStyles({
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
  skillsContainer: {
    marginTop: '8px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  noSkills: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: '8px',
  },
});

const SkillsSection = ({ skills }) => {
  const classes = useStyles();
  
  // Split skills string into an array
  const skillsArray = skills ? skills.split(',').map(skill => skill.trim()) : [];

  return (
    <Box mt={4}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <SchoolIcon /> Skills & Expertise
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box className={classes.skillsContainer}>
        {skillsArray.length > 0 ? (
          skillsArray.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              className={classes.chip}
              color="primary"
              variant="outlined"
            />
          ))
        ) : (
          <Typography variant="body2" className={classes.noSkills}>
            No skills listed yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SkillsSection;