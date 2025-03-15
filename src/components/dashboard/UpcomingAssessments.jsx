// src/components/dashboard/UpcomingAssessments.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Alarm as AlarmIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  upcomingAssessmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
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
  assessmentListItem: {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  assessmentTitle: {
    fontWeight: '500',
  },
  assessmentDueDate: {
    color: '#f44336',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: '0.875rem',
      marginRight: '4px',
    },
  },
  completeButton: {
    marginTop: '8px',
  },
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

// Format date to display in a readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Calculate days left until due date
const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = Math.abs(due - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const UpcomingAssessments = ({ assessments = [] }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Paper className={classes.paper}>
      <Box className={classes.upcomingAssessmentHeader}>
        <Typography variant="h6" className={classes.sectionTitle} sx={{ mb: 0 }}>
          <AlarmIcon /> Upcoming Assessments
        </Typography>
        
        <Button 
          variant="text" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/assessments?tab=pending')}
        >
          View All
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {assessments && assessments.length > 0 ? (
        <List disablePadding>
          {assessments.map((assessment) => (
            <ListItem key={assessment.id} className={classes.assessmentListItem} disablePadding>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={7}>
                  <Typography variant="subtitle1" className={classes.assessmentTitle}>
                    {assessment.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {assessment.description}
                  </Typography>
                  <Box className={classes.assessmentDueDate}>
                    <AlarmIcon />
                    <Typography variant="body2">
                      Due: {formatDate(assessment.due_date)} ({getDaysRemaining(assessment.due_date)} days left)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {assessment.duration_minutes} mins
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Marks: {assessment.total_marks}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/assessments?tab=pending`)}
                    className={classes.completeButton}
                  >
                    Start
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box className={classes.noContent}>
          <Typography variant="body1">
            No upcoming assessments at this time.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UpcomingAssessments;