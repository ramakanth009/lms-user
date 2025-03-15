// src/components/profile/AcademicMetrics.jsx
import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  progressCard: {
    padding: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressIconBg: {
    position: 'absolute',
    fontSize: '120px',
    right: '-20px',
    bottom: '-20px',
    opacity: '0.05',
    color: '#000',
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
  progressLabel: {
    fontWeight: '500',
  },
});

const AcademicMetrics = ({ profile }) => {
  const classes = useStyles();
  
  // Extract metrics
  const { 
    role_progress = 0, 
    current_cgpa = 0, 
    completed_assessments = 0 
  } = profile || {};
  
  // Define metric cards
  const metrics = [
    {
      label: "Career Progress",
      value: role_progress || 0,
      color: "#7E57C2",
      format: (val) => `${Math.round(val)}%`,
    },
    {
      label: "Current CGPA",
      value: current_cgpa ? (current_cgpa / 10) * 100 : 0,
      display: current_cgpa || 0,
      color: "#4caf50",
    },
    {
      label: "Completed Assessments",
      value: completed_assessments ? (completed_assessments / (completed_assessments + 2)) * 100 : 0,
      display: completed_assessments || 0,
      color: "#f44336",
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Paper className={classes.progressCard} elevation={0} variant="outlined">
            <Box className={classes.progressContainer}>
              <CircularProgress
                variant="determinate"
                value={metric.value}
                size={80}
                thickness={5}
                sx={{ color: metric.color }}
              />
              <Box className={classes.progressValue}>
                {metric.format ? metric.format(metric.value) : 
                  (metric.display !== undefined ? metric.display : metric.value)}
              </Box>
            </Box>
            <Typography className={classes.progressLabel}>
              {metric.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AcademicMetrics;