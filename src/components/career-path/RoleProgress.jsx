// src/components/career-path/RoleProgress.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  AssignmentTurnedIn as CompletedIcon,
  MenuBook as CurriculumIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    padding: '16px',
  },
  progressContainer: {
    marginBottom: '24px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  progressValue: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: '12px',
    borderRadius: '6px',
  },
  statsContainer: {
    marginTop: '24px',
  },
  statCard: {
    height: '100%',
    padding: '16px',
    textAlign: 'center',
    backgroundColor: '#f9f9fc',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  statIcon: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    borderRadius: '50%',
    padding: '8px',
    marginBottom: '8px',
    display: 'inline-flex',
    color: '#7E57C2',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statLabel: {
    color: '#666',
  },
  milestoneContainer: {
    marginTop: '16px',
    position: 'relative',
    height: '60px',
  },
  milestone: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
  milestoneIcon: {
    backgroundColor: '#f5f5f5',
    border: '2px solid #ccc',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  milestoneCompleted: {
    backgroundColor: '#7E57C2',
    borderColor: '#7E57C2',
    color: 'white',
  },
  milestoneActive: {
    borderColor: '#7E57C2',
    color: '#7E57C2',
  },
  milestoneLabel: {
    fontSize: '10px',
    color: '#666',
    marginTop: '4px',
    width: '60px',
  },
  milestoneLine: {
    position: 'absolute',
    top: '12px',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#ccc',
    zIndex: -1,
  },
  milestoneLineCompleted: {
    backgroundColor: '#7E57C2',
  },
  infoButton: {
    padding: '4px',
  },
});

const RoleProgress = () => {
  const classes = useStyles();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // This would be replaced with the actual endpoint for profile data
        const response = await axios.get('http://localhost:8000/api/student/student_dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProfileData({
          // Extract relevant data or use mock data
          progress: 45, // Example progress percentage
          totalAssessments: response.data.stats.total_assessments || 0,
          completedAssessments: response.data.stats.completed_assessments || 0,
          averageScore: response.data.stats.average_score || 0,
          totalCurriculum: 4, // Example total curriculum
          completedCurriculum: 2, // Example completed curriculum
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use mock data as fallback
        setProfileData({
          progress: 45,
          totalAssessments: 5,
          completedAssessments: 2,
          averageScore: 72.5,
          totalCurriculum: 4,
          completedCurriculum: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !profileData) {
    return (
      <Box className={classes.root}>
        <Typography variant="subtitle1" gutterBottom>
          Loading progress...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  const { 
    progress, 
    totalAssessments, 
    completedAssessments, 
    averageScore,
    totalCurriculum,
    completedCurriculum
  } = profileData;

  // Calculate milestone positions (example milestones)
  const milestones = [
    { position: 0, label: 'Beginner', completed: true },
    { position: 25, label: 'Basic', completed: progress >= 25 },
    { position: 50, label: 'Intermediate', completed: progress >= 50 },
    { position: 75, label: 'Advanced', completed: progress >= 75 },
    { position: 100, label: 'Expert', completed: progress >= 100 },
  ];

  return (
    <Box className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Your Progress
        <Tooltip title="This shows your overall progress in your career path">
          <IconButton className={classes.infoButton} size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
      
      {/* Main Progress Bar */}
      <Box className={classes.progressContainer}>
        <Box className={classes.progressLabel}>
          <Typography variant="body2">Overall Completion</Typography>
          <Typography variant="body2" className={classes.progressValue}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          className={classes.progressBar}
          color="primary"
        />
      </Box>
      
      {/* Milestone visualization */}
      <Box className={classes.milestoneContainer}>
        <Box className={classes.milestoneLine} />
        <Box 
          className={`${classes.milestoneLine} ${classes.milestoneLineCompleted}`} 
          sx={{ width: `${progress}%` }}
        />
        
        {milestones.map((milestone, index) => (
          <Box 
            key={index}
            className={classes.milestone}
            sx={{ left: `${milestone.position}%` }}
          >
            <Box 
              className={`
                ${classes.milestoneIcon} 
                ${milestone.completed ? classes.milestoneCompleted : ''}
                ${!milestone.completed && progress >= milestone.position ? classes.milestoneActive : ''}
              `}
            >
              {index + 1}
            </Box>
            <Typography className={classes.milestoneLabel}>
              {milestone.label}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Stats Grid */}
      <Grid container spacing={2} className={classes.statsContainer}>
        <Grid item xs={12} sm={4}>
          <Box className={classes.statCard}>
            <Box className={classes.statIcon}>
              <AssessmentIcon />
            </Box>
            <Typography className={classes.statValue}>
              {completedAssessments}/{totalAssessments}
            </Typography>
            <Typography className={classes.statLabel}>
              Assessments Completed
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box className={classes.statCard}>
            <Box className={classes.statIcon}>
              <CurriculumIcon />
            </Box>
            <Typography className={classes.statValue}>
              {completedCurriculum}/{totalCurriculum}
            </Typography>
            <Typography className={classes.statLabel}>
              Curriculum Modules
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box className={classes.statCard}>
            <Box className={classes.statIcon}>
              <CompletedIcon />
            </Box>
            <Typography className={classes.statValue}>
              {averageScore.toFixed(1)}%
            </Typography>
            <Typography className={classes.statLabel}>
              Average Score
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleProgress;