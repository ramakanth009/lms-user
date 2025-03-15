// src/components/assessment/AssessmentTabs.jsx
import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Schedule as ScheduleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  tabs: {
    marginBottom: '24px',
    '& .MuiTab-root': {
      minWidth: '120px',
      textTransform: 'none',
    },
  },
});

const AssessmentTabs = ({ 
  activeTab, 
  pendingCount = 0, 
  inProgressCount = 0, 
  completedCount = 0,
  onTabChange 
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    // Update URL with tab value
    let tabParam = 'pending';
    if (newValue === 1) tabParam = 'in-progress';
    else if (newValue === 2) tabParam = 'completed';
    
    navigate(`/assessments?tab=${tabParam}`);
    
    // Call the parent handler
    if (onTabChange) {
      onTabChange(event, newValue);
    }
  };

  return (
    <Paper className={classes.tabs}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab 
          label={`Pending (${pendingCount})`} 
          icon={<ScheduleIcon />} 
          iconPosition="start" 
        />
        <Tab 
          label={`In Progress (${inProgressCount})`} 
          icon={<HourglassEmptyIcon />} 
          iconPosition="start" 
        />
        <Tab 
          label={`Completed (${completedCount})`} 
          icon={<CheckCircleIcon />} 
          iconPosition="start" 
        />
      </Tabs>
    </Paper>
  );
};

export default AssessmentTabs;