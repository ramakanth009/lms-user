// src/components/assessment/AssessmentList.jsx
import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AssessmentCard from './AssessmentCard';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

const AssessmentList = ({ 
  assessments = [], 
  status, 
  loading = false, 
  onOpenAssessment,
  onStartAssessment
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (assessments.length === 0) {
    let emptyMessage = "No assessments found.";
    
    if (status === 'pending') {
      emptyMessage = "You don't have any pending assessments at the moment.";
    } else if (status === 'in_progress') {
      emptyMessage = "You don't have any in-progress assessments.";
    } else if (status === 'completed') {
      emptyMessage = "You haven't completed any assessments yet.";
    }
    
    return (
      <Box className={classes.emptyState}>
        <Typography variant="h6" gutterBottom>
          No assessments found
        </Typography>
        <Typography variant="body2">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {assessments.map((assessment) => (
        <Grid item xs={12} sm={6} md={4} key={assessment.id}>
          <AssessmentCard 
            assessment={assessment} 
            status={status}
            onOpen={() => onOpenAssessment(assessment)}
            onStart={status === 'pending' || status === 'in_progress' 
              ? () => onStartAssessment(assessment)
              : null
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AssessmentList;