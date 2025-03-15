// src/components/assessment/AssessmentSubmit.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Slide,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  stepperContainer: {
    marginBottom: '32px',
  },
  questionCard: {
    padding: '24px',
    marginTop: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  questionHeader: {
    marginBottom: '24px',
  },
  questionNumber: {
    backgroundColor: '#7E57C2',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  timerCard: {
    position: 'sticky',
    top: '84px',
    zIndex: 10,
    marginBottom: '16px',
  },
  timerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerIcon: {
    marginRight: '8px',
    color: '#7E57C2',
  },
  timerText: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  warningTimer: {
    color: '#ff9800',
  },
  dangerTimer: {
    color: '#f44336',
  },
  submitButton: {
    marginTop: '32px',
  },
  formControl: {
    marginTop: '16px',
    marginBottom: '16px',
    width: '100%',
  },
  optionLabel: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  progress: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  divider: {
    margin: '32px 0',
  },
  descriptiveAnswer: {
    marginTop: '16px',
  },
  successIcon: {
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '50%',
    padding: '4px',
    marginRight: '8px',
  },
  questionNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
  },
  questionNavItem: {
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '50%',
    cursor: 'pointer',
    fontWeight: 'medium',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  activeQuestion: {
    backgroundColor: '#7E57C2',
    color: 'white',
    borderColor: '#7E57C2',
    '&:hover': {
      backgroundColor: '#6A1B9A',
    },
  },
  answeredQuestion: {
    backgroundColor: '#E1BEE7',
    borderColor: '#E1BEE7',
    '&:hover': {
      backgroundColor: '#D1C4E9',
    },
  },
  timerAlert: {
    marginBottom: '16px',
  },
  resultInfoCard: {
    padding: '20px',
    marginTop: '24px',
    textAlign: 'center',
  },
  resultStatusIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  resultAttemptInfo: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  resultHistoryItem: {
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
  },
  feedbackBox: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginTop: '16px',
    border: '1px solid #dee2e6',
  }
});

const AssessmentSubmit = ({ assessment, onBack }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(assessment?.duration_minutes * 60 || 3600);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  
  const questions = assessment?.questions || [];
  
  // Initialize answers object with empty values
  useEffect(() => {
    if (questions.length > 0) {
      const initialAnswers = {};
      questions.forEach((_, index) => {
        initialAnswers[index] = { answer: '' };
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);
  
  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAssessment();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);
  
  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Get timer color based on time left
  const getTimerColor = () => {
    const totalDuration = assessment?.duration_minutes * 60 || 3600;
    const percentageLeft = (timeLeft / totalDuration) * 100;
    
    if (percentageLeft <= 10) return classes.dangerTimer;
    if (percentageLeft <= 25) return classes.warningTimer;
    return '';
  };
  
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleQuestionNavClick = (index) => {
    setActiveStep(index);
  };
  
  const handleAnswerChange = (value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [activeStep]: { answer: value }
    }));
  };
  
  const handleConfirmSubmit = () => {
    setConfirmSubmit(true);
  };
  
  const handleCancelSubmit = () => {
    setConfirmSubmit(false);
  };
  
  const handleConfirmExit = () => {
    setConfirmExit(true);
  };
  
  const handleCancelExit = () => {
    setConfirmExit(false);
  };
  
  const handleExitAssessment = () => {
    onBack();
  };
  
  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `http://localhost:8000/api/assessments/${assessment.id}/submit/`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSubmitSuccess(true);
      setSubmitResponse(response.data);
      
      // Close confirm dialog if open
      setConfirmSubmit(false);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmitError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleViewAllAssessments = () => {
    navigate('/assessments?tab=in-progress');
  };
  
  // Check if current question is answered
  const isQuestionAnswered = (questionIndex) => {
    return answers[questionIndex]?.answer !== '';
  };
  
  // Check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return questions.every((_, index) => isQuestionAnswered(index));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Render the current question
  const renderQuestion = () => {
    if (questions.length === 0 || activeStep >= questions.length) {
      return (
        <Paper className={classes.paper}>
          <Typography variant="h6">No questions available</Typography>
        </Paper>
      );
    }
    
    const currentQuestion = questions[activeStep];
    
    return (
      <Paper className={classes.questionCard}>
        <Box className={classes.questionHeader}>
          <Grid container alignItems="center">
            <Grid item>
              <Box className={classes.questionNumber}>
                {activeStep + 1}
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{currentQuestion.question_text}</Typography>
              <Typography variant="body2" color="textSecondary">
                Marks: {currentQuestion.marks}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {currentQuestion.type === 'mcq' ? (
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Select one option:</FormLabel>
            <RadioGroup
              value={answers[activeStep]?.answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {currentQuestion.options && currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                  className={classes.optionLabel}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
          <TextField
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            placeholder="Write your answer here..."
            value={answers[activeStep]?.answer || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className={classes.descriptiveAnswer}
          />
        )}
        
        <Box className={classes.navigationButtons}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          
          {activeStep < questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmSubmit}
              endIcon={<CheckIcon />}
            >
              Submit Assessment
            </Button>
          )}
        </Box>
      </Paper>
    );
  };
  
  // Render question navigation
  const renderQuestionNav = () => {
    return (
      <Box className={classes.questionNav}>
        {questions.map((_, index) => (
          <Box
            key={index}
            className={`${classes.questionNavItem} ${
              activeStep === index ? classes.activeQuestion : ''
            } ${
              isQuestionAnswered(index) && activeStep !== index ? classes.answeredQuestion : ''
            }`}
            onClick={() => handleQuestionNavClick(index)}
          >
            {index + 1}
          </Box>
        ))}
      </Box>
    );
  };
  
  // If submission was successful, show a success message
  if (submitSuccess) {
    const { data } = submitResponse || {};
    const passStatus = data?.passed;
    const attemptNumber = data?.attempt_number;
    const history = data?.history || [];
    
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Assessment Submitted
          </Typography>
        </Box>
        
        <Paper className={classes.resultInfoCard}>
          {passStatus ? (
            <CheckIcon color="success" className={classes.resultStatusIcon} fontSize="large" />
          ) : (
            <CloseIcon color="error" className={classes.resultStatusIcon} fontSize="large" />
          )}
          
          <Typography variant="h5" gutterBottom>
            {passStatus ? 'Congratulations!' : 'Assessment Completed'}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {passStatus 
              ? 'You have successfully passed this assessment!' 
              : 'Your assessment has been submitted and evaluated.'}
          </Typography>
          
          <Box className={classes.resultAttemptInfo}>
            <Typography variant="body2">
              <strong>Attempt:</strong> {attemptNumber}
            </Typography>
            <Typography variant="body2">
              <strong>Submitted:</strong> {formatDate(data?.current_attempt?.submitted_at)}
            </Typography>
          </Box>
          
          {data?.current_attempt?.feedback && (
            <Box className={classes.feedbackBox}>
              <Typography variant="subtitle2" gutterBottom>
                Feedback:
              </Typography>
              <Typography variant="body2">
                {data.current_attempt.feedback}
              </Typography>
            </Box>
          )}
          
          {history && history.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Attempt History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {history.map((attempt, index) => (
                <Box key={index} className={classes.resultHistoryItem}>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="body2">
                        <strong>Attempt #{attempt.attempt_number}</strong>
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip 
                        size="small" 
                        label={attempt.passed ? "Passed" : "Failed"} 
                        color={attempt.passed ? "success" : "error"} 
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(attempt.submitted_at)}
                  </Typography>
                  {attempt.score !== undefined && (
                    <Typography variant="body2">
                      Score: {attempt.score}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
          
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewAllAssessments}
            >
              View All Assessments
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleConfirmExit} color="inherit" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="500">
            {assessment?.title}
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          {/* Progress indicator */}
          <Paper className={classes.stepperContainer} elevation={0}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Question {activeStep + 1} of {questions.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(activeStep / (questions.length - 1)) * 100}
                className={classes.progress}
              />
              
              {/* Question nav buttons */}
              {renderQuestionNav()}
            </Box>
          </Paper>
          
          {/* Current question */}
          {renderQuestion()}
        </Grid>
        
        <Grid item xs={12} md={3}>
          {/* Timer card */}
          <Card className={classes.timerCard}>
            <CardContent className={classes.timerContent}>
              <AccessTimeIcon className={classes.timerIcon} />
              <Typography className={`${classes.timerText} ${getTimerColor()}`}>
                Time Left: {formatTime(timeLeft)}
              </Typography>
            </CardContent>
          </Card>
          
          {/* Assessment info card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assessment Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Questions Answered
                </Typography>
                <Typography variant="h5">
                  {Object.values(answers).filter(a => a.answer !== '').length} / {questions.length}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total Marks
                </Typography>
                <Typography variant="h5">
                  {assessment?.total_marks || 0}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className={classes.submitButton}
                startIcon={<SaveIcon />}
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Submit confirmation dialog */}
      <Dialog
        open={confirmSubmit}
        onClose={handleCancelSubmit}
      >
        <DialogTitle>
          Submit Assessment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {areAllQuestionsAnswered() ? 
              'Are you sure you want to submit this assessment? You won\'t be able to make changes after submission.' :
              'You have unanswered questions. Are you sure you want to submit this assessment? You won\'t be able to make changes after submission.'
            }
          </DialogContentText>
          
          {!areAllQuestionsAnswered() && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You've answered {Object.values(answers).filter(a => a.answer !== '').length} out of {questions.length} questions.
            </Alert>
          )}
          
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitAssessment} 
            variant="contained" 
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Exit confirmation dialog */}
      <Dialog
        open={confirmExit}
        onClose={handleCancelExit}
      >
        <DialogTitle>
          Exit Assessment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit? Your progress will not be saved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelExit}>
            Cancel
          </Button>
          <Button 
            onClick={handleExitAssessment} 
            variant="contained" 
            color="error"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentSubmit;