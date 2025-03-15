// src/components/dashboard/PerformanceOverview.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Timeline as TimelineIcon } from '@mui/icons-material';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
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
  progressContainer: {
    position: 'relative',
    display: 'inline-flex',
    marginBottom: '16px',
  },
  progressValue: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  gradeDistribution: {
    marginTop: '24px',
  },
  gradeItem: {
    marginBottom: '12px',
  },
  gradeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  gradeLetter: {
    fontWeight: '500',
  },
  gradeCount: {
    fontWeight: '600',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
  },
  progressBarA: {
    backgroundColor: '#4caf50 !important',
  },
  progressBarB: {
    backgroundColor: '#8bc34a !important',
  },
  progressBarC: {
    backgroundColor: '#ffeb3b !important',
  },
  progressBarD: {
    backgroundColor: '#ff9800 !important',
  },
  progressBarF: {
    backgroundColor: '#f44336 !important',
  },
  noContent: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
});

const PerformanceOverview = ({ stats }) => {
  const classes = useStyles();
  
  // Extract relevant stats
  const { 
    average_score = 0, 
    completed_assessments = 0, 
    grade_distribution = {} 
  } = stats || {};

  // If no completed assessments, show placeholder
  if (!completed_assessments) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          <TimelineIcon /> Performance Overview
        </Typography>
        <Box className={classes.noContent}>
          <Typography variant="body1">
            Complete assessments to view your performance overview.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <TimelineIcon /> Performance Overview
      </Typography>
      
      <Box className={classes.progressContainer} sx={{ width: '100%', mb: 3 }}>
        <CircularProgress
          variant="determinate"
          value={average_score}
          size={120}
          thickness={5}
          sx={{ color: '#7E57C2' }}
        />
        <Box className={classes.progressValue}>
          {average_score.toFixed(1)}%
        </Box>
      </Box>
      
      <Box className={classes.gradeDistribution}>
        <Typography variant="subtitle2" gutterBottom>
          Grade Distribution:
        </Typography>
        
        {Object.entries(grade_distribution).map(([grade, count]) => (
          <Box key={grade} className={classes.gradeItem}>
            <Box className={classes.gradeLabel}>
              <Typography variant="body2" className={classes.gradeLetter}>
                Grade {grade}
              </Typography>
              <Typography variant="body2" className={classes.gradeCount}>
                {count}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(count / completed_assessments) * 100}
              className={`${classes.progressBar} ${
                grade === 'A' ? classes.progressBarA :
                grade === 'B' ? classes.progressBarB :
                grade === 'C' ? classes.progressBarC :
                grade === 'D' ? classes.progressBarD :
                classes.progressBarF
              }`}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PerformanceOverview;