// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Import our newly created components
import WelcomeSection from './WelcomeSection';
import StatsSection from './StatsSection';
import LatestPerformanceReport from './LatestPerformanceReport';
import PerformanceOverview from './PerformanceOverview';
import UpcomingAssessments from './UpcomingAssessments';
import RecentActivity from './RecentActivity';
import ProfileCompletionAlert from './ProfileCompletionAlert';

const useStyles = makeStyles({
  root: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
});

const Dashboard = () => {
  const classes = useStyles();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        // API endpoint to fetch dashboard data
        try {
          const response = await axios.get('http://localhost:8000/api/student/student_dashboard/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setDashboardData(response.data);
          setError(null);
        } catch (apiError) {
          console.error('Error fetching dashboard from API:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to load dashboard data. Please try again later.');
        
        // For development/demo purposes, use mock data when API fails
        if (process.env.NODE_ENV === 'development') {
          const mockData = {
            stats: {
              total_assessments: 5,
              completed_assessments: 2,
              average_score: 72.5,
              grade_distribution: {
                'A': 1,
                'B': 0,
                'C': 1,
                'D': 0,
                'F': 0,
              }
            },
            reports: [
              {
                id: 7,
                user_email: 'student@example.com',
                assessment_title: 'Web Development Fundamentals Assessment',
                overall_performance: 75.0,
                performance_grade: 'B+',
                strengths: 'Strong grasp of Frontend Basics\nGood understanding of concepts\nAbility to apply knowledge to solve problems',
                improvement_areas: 'Needs to review and improve JavaScript skills\nRequires more practice with React\nShould focus on building a robust portfolio',
                key_skill_focus: 'JavaScript',
                created_at: '2025-03-11T06:15:49.626308Z'
              }
            ],
            upcoming_assessments: [
              {
                id: 2,
                title: 'JavaScript Fundamentals',
                description: 'Assessment covering basic JavaScript concepts',
                due_date: '2025-04-15T23:59:59Z',
                total_marks: 50,
                duration_minutes: 60
              },
              {
                id: 3,
                title: 'React & State Management',
                description: 'Advanced assessment on React.js and state management concepts',
                due_date: '2025-04-22T23:59:59Z',
                total_marks: 75,
                duration_minutes: 90
              }
            ],
            recent_activity: [
              {
                id: 1,
                type: 'assessment_completed',
                title: 'Assessment Completed',
                description: 'You completed Web Development Fundamentals Assessment with a score of 75%',
                date: '2025-03-11T06:15:49Z'
              },
              {
                id: 2,
                type: 'curriculum_added',
                title: 'New Curriculum Available',
                description: 'Full Stack Web Development curriculum has been added to your learning path',
                date: '2025-03-10T14:30:00Z'
              },
              {
                id: 3,
                type: 'profile_created',
                title: 'Profile Created',
                description: 'You successfully created your student profile',
                date: '2025-03-09T10:05:22Z'
              }
            ],
            profile_completion: {
              complete: true,
              percentage: 100,
            }
          };
          
          setDashboardData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Dashboard
          </Typography>
        </Box>
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Dashboard
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Dashboard
          </Typography>
        </Box>
        <Alert severity="info">
          No dashboard data available. Please try again later.
        </Alert>
      </Box>
    );
  }

  // Extract data from dashboardData
  const { 
    stats, 
    reports, 
    upcoming_assessments, 
    recent_activity, 
    profile_completion 
  } = dashboardData;
  
  // Get the latest report (if available)
  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          Dashboard
        </Typography>
      </Box>
      
      {/* Welcome Card */}
      <WelcomeSection />
      
      {/* Profile Completion Alert */}
      <ProfileCompletionAlert profileCompletion={profile_completion} />
      
      {/* Stats Overview */}
      <StatsSection stats={stats} />
      
      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Latest Performance Report */}
          {latestReport && <LatestPerformanceReport report={latestReport} />}
          
          {/* Upcoming Assessments */}
          <UpcomingAssessments assessments={upcoming_assessments} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Performance Overview */}
          <PerformanceOverview stats={stats} />
          
          {/* Recent Activity */}
          <RecentActivity activities={recent_activity} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;