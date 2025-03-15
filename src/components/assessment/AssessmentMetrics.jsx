// src/components/assessment/AssessmentMetrics.jsx
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  metricsContainer: {
    marginBottom: '24px',
  },
  metricCard: {
    padding: '16px',
    borderRadius: '8px',
    height: '100%',
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '14px',
    color: '#666',
  },
});

const AssessmentMetrics = ({ stats }) => {
  const classes = useStyles();
  
  // Extract statistics or provide defaults
  const {
    total_assessments = 0,
    pending_assessments = 0,
    in_progress_assessments = 0,
    completed_assessments = 0,
    average_score = 0
  } = stats || {};

  return (
    <Grid container spacing={3} className={classes.metricsContainer}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.metricCard} elevation={1}>
          <Typography className={classes.metricValue}>{total_assessments}</Typography>
          <Typography className={classes.metricLabel}>Total Assessments</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.metricCard} elevation={1}>
          <Typography className={classes.metricValue}>{pending_assessments}</Typography>
          <Typography className={classes.metricLabel}>Pending Assessments</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.metricCard} elevation={1}>
          <Typography className={classes.metricValue}>{completed_assessments}</Typography>
          <Typography className={classes.metricLabel}>Completed Assessments</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className={classes.metricCard} elevation={1}>
          <Typography className={classes.metricValue}>{average_score}%</Typography>
          <Typography className={classes.metricLabel}>Average Score</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AssessmentMetrics;