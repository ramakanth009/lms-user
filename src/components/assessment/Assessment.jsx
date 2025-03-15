// src/components/assessment/Assessment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import axios from 'axios';
import AssessmentCard from './AssessmentCard';
import AssessmentSubmit from './AssessmentSubmit';

// Merged styles directly into this file (previously in styles.assessment.jsx)
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
  tabs: {
    marginBottom: '24px',
    '& .MuiTab-root': {
      minWidth: '120px',
      textTransform: 'none',
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  cardContent: {
    flexGrow: 1,
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  cardDescription: {
    color: '#666',
    marginBottom: '16px',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
  statusChip: {
    fontWeight: '500',
  },
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
  assessmentDetails: {
    marginTop: '24px',
    marginBottom: '16px',
  },
  assessmentInfoGrid: {
    marginTop: '16px',
  },
  assessmentInfoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    '& svg': {
      marginRight: '8px',
      color: '#7E57C2',
    },
  },
  infoCard: {
    height: '100%',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  },
  scoreCard: {
    padding: '24px',
    textAlign: 'center',
    borderRadius: '8px',
  },
  circularProgressContainer: {
    position: 'relative',
    display: 'inline-flex',
  },
  circularProgressLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
});

const Assessment = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [inProgressAssessments, setInProgressAssessments] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [assessmentSubmitMode, setAssessmentSubmitMode] = useState(false);

  // Determine active tab from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    if (tab === 'pending') setActiveTab(0);
    else if (tab === 'in-progress') setActiveTab(1);
    else if (tab === 'completed') setActiveTab(2);
    else {
      // Default to pending if no tab is specified
      navigate('/assessments?tab=pending', { replace: true });
    }
  }, [location, navigate]);

  // Fetch assessments data
  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/student/my_assessments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Process assessments by type
        setPendingAssessments(response.data.pending_assessments || []);
        setInProgressAssessments(response.data.in_progress_assessments || []);
        setCompletedAssessments(response.data.completed_assessments || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Update URL with tab value
    let tabParam = 'pending';
    if (newValue === 1) tabParam = 'in-progress';
    else if (newValue === 2) tabParam = 'completed';
    
    navigate(`/assessments?tab=${tabParam}`);
  };

  const handleOpenAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowAssessmentDialog(true);
  };

  const handleCloseAssessmentDialog = () => {
    setShowAssessmentDialog(false);
  };

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentSubmitMode(true);
  };

  const handleBackToAssessment = () => {
    setAssessmentSubmitMode(false);
  };

  // Render assessment metrics/summary cards
  const renderMetrics = () => {
    const totalAssessments = pendingAssessments.length + inProgressAssessments.length + completedAssessments.length;
    const pendingCount = pendingAssessments.length;
    const inProgressCount = inProgressAssessments.length;
    const completedCount = completedAssessments.length;
    
    // Calculate average score if there are completed assessments
    let averageScore = 0;
    if (completedCount > 0) {
      const totalScore = completedAssessments.reduce((sum, assessment) => {
        return sum + (assessment.best_score || 0);
      }, 0);
      averageScore = (totalScore / completedCount).toFixed(1);
    }
    
    return (
      <Grid container spacing={3} className={classes.metricsContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.metricCard} elevation={1}>
            <Typography className={classes.metricValue}>{totalAssessments}</Typography>
            <Typography className={classes.metricLabel}>Total Assessments</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.metricCard} elevation={1}>
            <Typography className={classes.metricValue}>{pendingCount}</Typography>
            <Typography className={classes.metricLabel}>Pending Assessments</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.metricCard} elevation={1}>
            <Typography className={classes.metricValue}>{completedCount}</Typography>
            <Typography className={classes.metricLabel}>Completed Assessments</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.metricCard} elevation={1}>
            <Typography className={classes.metricValue}>{averageScore}%</Typography>
            <Typography className={classes.metricLabel}>Average Score</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Render assessment cards based on active tab
  const renderAssessments = () => {
    let assessmentsToRender = [];
    
    switch (activeTab) {
      case 0:
        assessmentsToRender = pendingAssessments;
        break;
      case 1:
        assessmentsToRender = inProgressAssessments;
        break;
      case 2:
        assessmentsToRender = completedAssessments;
        break;
      default:
        assessmentsToRender = pendingAssessments;
    }
    
    if (loading) {
      return (
        <Box className={classes.loadingContainer}>
          <CircularProgress color="primary" />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      );
    }
    
    if (assessmentsToRender.length === 0) {
      return (
        <Box className={classes.emptyState}>
          <Typography variant="h6" gutterBottom>
            No assessments found
          </Typography>
          <Typography variant="body2">
            {activeTab === 0 && "You don't have any pending assessments at the moment."}
            {activeTab === 1 && "You don't have any in-progress assessments."}
            {activeTab === 2 && "You haven't completed any assessments yet."}
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {assessmentsToRender.map((assessment) => (
          <Grid item xs={12} sm={6} md={4} key={assessment.id}>
            <AssessmentCard 
              assessment={assessment} 
              status={
                activeTab === 0 ? 'pending' : 
                activeTab === 1 ? 'in_progress' : 
                'completed'
              }
              onOpen={() => handleOpenAssessment(assessment)}
              onStart={activeTab === 0 ? () => handleStartAssessment(assessment) : null}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  // If in assessment submit mode, show the submission interface
  if (assessmentSubmitMode && selectedAssessment) {
    return (
      <AssessmentSubmit 
        assessment={selectedAssessment} 
        onBack={handleBackToAssessment}
      />
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          Assessments
        </Typography>
      </Box>
      
      {renderMetrics()}
      
      <Paper className={classes.tabs}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label={`Pending (${pendingAssessments.length})`} 
            icon={<ScheduleIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label={`In Progress (${inProgressAssessments.length})`} 
            icon={<HourglassEmptyIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label={`Completed (${completedAssessments.length})`} 
            icon={<CheckCircleIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Paper>
      
      {renderAssessments()}
      
      {/* Assessment Details Dialog */}
      <Dialog
        open={showAssessmentDialog && !assessmentSubmitMode}
        onClose={handleCloseAssessmentDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAssessment && (
          <>
            <DialogTitle>
              <Typography variant="h5" fontWeight="500">
                {selectedAssessment.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedAssessment.description}
              </Typography>
              
              <Grid container spacing={3} className={classes.assessmentInfoGrid}>
                <Grid item xs={12} sm={6}>
                  <Card className={classes.infoCard}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Assessment Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box className={classes.assessmentInfoItem}>
                        <AssignmentIcon />
                        <Typography>
                          Total Questions: {selectedAssessment.questions ? selectedAssessment.questions.length : 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box className={classes.assessmentInfoItem}>
                        <ScheduleIcon />
                        <Typography>
                          Duration: {selectedAssessment.duration_minutes} minutes
                        </Typography>
                      </Box>
                      
                      <Box className={classes.assessmentInfoItem}>
                        <CheckCircleOutlineIcon />
                        <Typography>
                          Total Marks: {selectedAssessment.total_marks}
                        </Typography>
                      </Box>
                      
                      {activeTab === 2 && (
                        <Box className={classes.assessmentInfoItem}>
                          <ErrorOutlineIcon />
                          <Typography>
                            Attempts: {selectedAssessment.total_attempts || 1}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {activeTab === 2 && selectedAssessment.best_score !== undefined && (
                  <Grid item xs={12} sm={6}>
                    <Card className={classes.infoCard}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Performance
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box className={classes.scoreCard}>
                          <Box className={classes.circularProgressContainer}>
                            <CircularProgress
                              variant="determinate"
                              value={selectedAssessment.best_percentage || 0}
                              size={120}
                              thickness={5}
                              sx={{
                                color: selectedAssessment.overall_status === 'Passed' ? '#4caf50' : '#ff9800',
                              }}
                            />
                            <Box className={classes.circularProgressLabel}>
                              {selectedAssessment.best_percentage?.toFixed(1) || 0}%
                            </Box>
                          </Box>
                          
                          <Typography variant="h6" sx={{ mt: 2 }}>
                            {selectedAssessment.overall_status}
                          </Typography>
                          
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Best Score: {selectedAssessment.best_score} / {selectedAssessment.total_marks}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
              
              {activeTab === 2 && selectedAssessment.attempts && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Attempt History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List>
                    {selectedAssessment.attempts.map((attempt, index) => (
                      <Paper key={index} sx={{ mb: 2, p: 2 }}>
                        <ListItem disableGutters>
                          <ListItemText
                            primary={`Attempt #${attempt.attempt_number}`}
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  Score: {attempt.score}
                                </Typography>
                                <Typography variant="body2">
                                  Status: {attempt.passed ? 'Passed' : 'Failed'}
                                </Typography>
                                <Typography variant="body2">
                                  Submitted: {new Date(attempt.submitted_at).toLocaleString()}
                                </Typography>
                                {attempt.feedback && (
                                  <Box mt={1} p={1} bgcolor="#f5f5f5" borderRadius={1}>
                                    <Typography variant="body2" fontWeight="500">
                                      Feedback:
                                    </Typography>
                                    <Typography variant="body2">
                                      {attempt.feedback}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                          <Chip 
                            label={attempt.passed ? 'Passed' : 'Failed'} 
                            color={attempt.passed ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAssessmentDialog}>Close</Button>
              {activeTab === 0 && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    handleCloseAssessmentDialog();
                    handleStartAssessment(selectedAssessment);
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Assessment
                </Button>
              )}
              {activeTab === 1 && selectedAssessment.status === 'in_progress' && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    handleCloseAssessmentDialog();
                    handleStartAssessment(selectedAssessment);
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue Assessment
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Assessment;