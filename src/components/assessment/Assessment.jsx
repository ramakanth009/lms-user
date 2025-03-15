// src/components/assessment/Assessment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Import subcomponents
import AssessmentMetrics from './AssessmentMetrics';
import AssessmentTabs from './AssessmentTabs';
import AssessmentList from './AssessmentList';
import AssessmentDetailsDialog from './AssessmentDetailsDialog';
import AssessmentSubmit from './AssessmentSubmit';

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
});

const Assessment = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for assessments data
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [inProgressAssessments, setInProgressAssessments] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [assessmentSubmitMode, setAssessmentSubmitMode] = useState(false);

  // Extract stats for the metrics component
  const stats = {
    total_assessments: pendingAssessments.length + inProgressAssessments.length + completedAssessments.length,
    pending_assessments: pendingAssessments.length,
    in_progress_assessments: inProgressAssessments.length,
    completed_assessments: completedAssessments.length,
  };

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
        
        try {
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
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Failed to load assessments. Please try again later.');
        
        // Mock data for development
        if (process.env.NODE_ENV === 'development') {
          setPendingAssessments([
            {
              id: 1,
              title: 'JavaScript Fundamentals',
              description: 'Assessment covering basic JavaScript concepts',
              duration_minutes: 60,
              total_marks: 50,
              questions: Array(10).fill({ type: 'mcq' }) // Mock 10 questions
            }
          ]);
          setInProgressAssessments([]);
          setCompletedAssessments([
            {
              id: 2,
              title: 'Web Development Basics',
              description: 'Assessment on HTML, CSS and basic JavaScript',
              duration_minutes: 45,
              total_marks: 40,
              questions: Array(8).fill({ type: 'mcq' }),
              best_score: 32,
              best_percentage: 80,
              overall_status: 'Passed',
              attempts: [
                {
                  attempt_number: 1,
                  score: 32,
                  passed: true,
                  submitted_at: '2025-03-10T14:30:00Z',
                  feedback: 'Good understanding of web development concepts.'
                }
              ]
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  // Get assessments based on active tab
  const getAssessmentsForTab = () => {
    switch (activeTab) {
      case 0: return pendingAssessments;
      case 1: return inProgressAssessments;
      case 2: return completedAssessments;
      default: return pendingAssessments;
    }
  };

  // Get status based on active tab
  const getStatusForTab = () => {
    switch (activeTab) {
      case 0: return 'pending';
      case 1: return 'in_progress';
      case 2: return 'completed';
      default: return 'pending';
    }
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
      
      {/* Assessment Metrics */}
      <AssessmentMetrics stats={stats} />
      
      {/* Assessment Tabs */}
      <AssessmentTabs 
        activeTab={activeTab}
        pendingCount={pendingAssessments.length}
        inProgressCount={inProgressAssessments.length}
        completedCount={completedAssessments.length}
        onTabChange={handleTabChange}
      />
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Assessment List */}
      <AssessmentList 
        assessments={getAssessmentsForTab()}
        status={getStatusForTab()}
        loading={loading}
        onOpenAssessment={handleOpenAssessment}
        onStartAssessment={handleStartAssessment}
      />
      
      {/* Assessment Details Dialog */}
      <AssessmentDetailsDialog 
        open={showAssessmentDialog && !assessmentSubmitMode}
        assessment={selectedAssessment}
        activeTab={activeTab}
        onClose={handleCloseAssessmentDialog}
        onStartAssessment={handleStartAssessment}
      />
    </Box>
  );
};

export default Assessment;