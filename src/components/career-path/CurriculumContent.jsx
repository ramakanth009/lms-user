// src/components/career-path/CurriculumContent.jsx
import React from 'react';
import {
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ModuleAccordion from './ModuleAccordion';
import RecommendedProjects from './RecommendedProjects';

const useStyles = makeStyles({
  moduleContainer: {
    marginTop: '24px',
  },
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

const CurriculumContent = ({ curriculum }) => {
  const classes = useStyles();

  if (!curriculum || !curriculum.content) {
    return (
      <Box className={classes.noContent}>
        <Typography variant="body1">
          No curriculum content available.
        </Typography>
      </Box>
    );
  }

  const { modules = [], recommended_projects = [] } = curriculum.content;

  return (
    <>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          {curriculum.title}
        </Typography>
        <Typography variant="body1">
          {curriculum.description}
        </Typography>
      </Box>
      
      <Divider />
      
      <Box className={classes.moduleContainer}>
        <Typography variant="h6" gutterBottom>
          Modules
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <ModuleAccordion modules={modules} />
      </Box>
      
      <RecommendedProjects projects={recommended_projects} />
    </>
  );
};

export default CurriculumContent;