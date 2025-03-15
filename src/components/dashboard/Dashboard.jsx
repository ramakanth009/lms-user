// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  EmojiEvents as AchievementIcon,
  Alarm as AlarmIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon,
  MenuBook as BookIcon,
  ArrowUpward as ArrowUpIcon,
  Star as StarIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';

// Merged styles directly into this file (previously in styles.systemlogs.jsx and styles.performancemetrics.jsx)
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
  welcomeCard: {
    padding: '24px',
    marginBottom: '24px',
    background: 'linear-gradient(45deg, #7E57C2 30%, #B39DDB 90%)',
    color: 'white',
  },
  welcomeText: {
    fontWeight: '500',
    marginBottom: '8px',
  },
  welcomeDescription: {
    opacity: '0.9',
    marginBottom: '16px',
  },
  paper: {
    padding: '24px',
    height: '100%',
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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
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
  cardAction: {
    marginTop: 'auto',
    textAlign: 'right',
    paddingTop: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  upcomingAssessmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  chipSuccess: {
    backgroundColor: '#4caf50 !important',
    color: 'white !important',
  },
  chipWarning: {
    backgroundColor: '#ff9800 !important',
    color: 'white !important',
  },
  avatarSuccess: {
    backgroundColor: '#4caf50 !important',
  },
  avatarWarning: {
    backgroundColor: '#ff9800 !important',
  },
  avatarInfo: {
    backgroundColor: '#2196f3 !important',
  },
  completeButton: {
    marginTop: '8px',
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
    padding: '32px',
    textAlign: 'center',
    color: '#666',
  },
  profileCompletionAlert: {
    marginBottom: '24px',
  },
});

const Dashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        // In a real app, we would fetch dashboard data from the server
        /*
        const response = await axios.get('http://localhost:8000/api/student/student_dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
        */
        
        // Mock data for demonstration
        setTimeout(() => {
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
            // Add extra data for UI display
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
            achievements: [
              {
                id: 1,
                title: 'First Assessment Completed',
                description: 'Completed your first assessment successfully',
                date: '2025-03-11T06:15:49Z',
                badge: 'beginner'
              }
            ],
            profile_completion: {
              complete: true,
              percentage: 100,
            }
          };
          
          setDashboardData(mockData);
          setError(null);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

  // Format strengths and improvement areas as arrays
  const formatBulletPoints = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

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

  if (error) {
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
        <Paper className={classes.paper}>
          <Typography variant="h6">No dashboard data available</Typography>
        </Paper>
      </Box>
    );
  }

  // Extract data from dashboardData
  const { stats, reports, upcoming_assessments, recent_activity, profile_completion } = dashboardData;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          Dashboard
        </Typography>
      </Box>
      
      {/* Welcome Card */}
      <Paper className={classes.welcomeCard} elevation={2}>
        <Typography variant="h5" className={classes.welcomeText}>
          Welcome to Your Learning Dashboard
        </Typography>
        <Typography variant="body1" className={classes.welcomeDescription}>
          Track your progress, manage assessments, and view your performance metrics all in one place.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => navigate('/career-path')}
          endIcon={<ArrowForwardIcon />}
        >
          View My Career Path
        </Button>
      </Paper>
      
      {/* Profile Completion Alert */}
      {!profile_completion.complete && (
        <Alert 
          severity="warning" 
          className={classes.profileCompletionAlert}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => navigate('/profile')}
            >
              Complete Profile
            </Button>
          }
        >
          Your profile is {profile_completion.percentage}% complete. Please complete your profile to access all features.
        </Alert>
      )}
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Assessments"
            value={stats.total_assessments}
            icon={<AssessmentIcon />}
            color="#7E57C2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Completed"
            value={stats.completed_assessments}
            icon={<CheckCircleIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Score"
            value={`${stats.average_score.toFixed(1)}%`}
            icon={<TimelineIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending"
            value={stats.total_assessments - stats.completed_assessments}
            icon={<AlarmIcon />}
            color="#f44336"
          />
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Latest Performance Report */}
          {reports && reports.length > 0 && (
            <Paper className={classes.paper} sx={{ mb: 3 }}>
              <Typography variant="h6" className={classes.sectionTitle}>
                <AssessmentIcon /> Latest Performance Report
              </Typography>
              
              <Box>
                <Typography variant="h6">
                  {reports[0].assessment_title}
                </Typography>
                <Box display="flex" alignItems="center" my={1}>
                  <Chip 
                    label={`Grade: ${reports[0].performance_grade}`}
                    className={reports[0].performance_grade.startsWith('A') || reports[0].performance_grade.startsWith('B') ? classes.chipSuccess : classes.chipWarning}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`Score: ${reports[0].overall_performance.toFixed(1)}%`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Strengths:
                    </Typography>
                    <List dense>
                      {formatBulletPoints(reports[0].strengths).map((strength, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemAvatar sx={{ minWidth: '32px' }}>
                            <StarIcon fontSize="small" color="primary" />
                          </ListItemAvatar>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Areas for Improvement:
                    </Typography>
                    <List dense>
                      {formatBulletPoints(reports[0].improvement_areas).map((area, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                          <ListItemAvatar sx={{ minWidth: '32px' }}>
                            <ArrowUpIcon fontSize="small" color="secondary" />
                          </ListItemAvatar>
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
                
                <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Skill to Focus On:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {reports[0].key_skill_focus}
                  </Typography>
                </Box>
                
                <Box className={classes.cardAction}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/assessments?tab=completed')}
                  >
                    View All Reports
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Upcoming Assessments */}
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
            
            {upcoming_assessments && upcoming_assessments.length > 0 ? (
              <List disablePadding>
                {upcoming_assessments.map((assessment) => (
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
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Performance Overview */}
          <Paper className={classes.paper} sx={{ mb: 3 }}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <TimelineIcon /> Performance Overview
            </Typography>
            
            <Box className={classes.progressContainer} sx={{ width: '100%', mb: 3 }}>
              <CircularProgress
                variant="determinate"
                value={stats.average_score}
                size={120}
                thickness={5}
                sx={{ color: '#7E57C2' }}
              />
              <Box className={classes.progressValue}>
                {stats.average_score.toFixed(1)}%
              </Box>
            </Box>
            
            <Box className={classes.gradeDistribution}>
              <Typography variant="subtitle2" gutterBottom>
                Grade Distribution:
              </Typography>
              
              {Object.entries(stats.grade_distribution).map(([grade, count]) => (
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
                    value={(count / stats.completed_assessments) * 100}
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
          
          {/* Recent Activity */}
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <AssignmentIcon /> Recent Activity
            </Typography>
            
            <ActivityFeed activities={recent_activity} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;