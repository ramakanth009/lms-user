// src/components/dashboard/StatsSection.jsx
import React from 'react';
import { Grid } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Alarm as AlarmIcon,
} from '@mui/icons-material';
import StatCard from './StatCard';

const StatsSection = ({ stats }) => {
  // Extract statistics from props
  const {
    total_assessments = 0,
    completed_assessments = 0,
    average_score = 0
  } = stats || {};

  // Calculate pending assessments
  const pendingAssessments = total_assessments - completed_assessments;

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Total Assessments"
          value={total_assessments}
          icon={<AssessmentIcon />}
          color="#7E57C2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Completed"
          value={completed_assessments}
          icon={<CheckCircleIcon />}
          color="#4caf50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Average Score"
          value={`${average_score.toFixed(1)}%`}
          icon={<TimelineIcon />}
          color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title="Pending"
          value={pendingAssessments}
          icon={<AlarmIcon />}
          color="#f44336"
        />
      </Grid>
    </Grid>
  );
};

export default StatsSection;