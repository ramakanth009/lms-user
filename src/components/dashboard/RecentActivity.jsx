// src/components/dashboard/RecentActivity.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import ActivityFeed from './ActivityFeed';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    // height: '100%',
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
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

const RecentActivity = ({ activities = [] }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <AssignmentIcon /> Recent Activity
      </Typography>
      
      {activities && activities.length > 0 ? (
        <ActivityFeed activities={activities} />
      ) : (
        <Box className={classes.noContent}>
          <Typography variant="body1">
            No recent activities to display.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RecentActivity;