// src/components/assessment/AssessmentDetailsDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
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

// Format date to display in a readable format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const AssessmentDetailsDialog = ({ 
  open, 
  assessment, 
  activeTab,
  onClose,
  onStartAssessment 
}) => {
  const classes = useStyles();

  if (!open || !assessment) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="500">
          {assessment.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {assessment.description}
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
                    Total Questions: {assessment.questions ? assessment.questions.length : 'N/A'}
                  </Typography>
                </Box>
                
                <Box className={classes.assessmentInfoItem}>
                  <ScheduleIcon />
                  <Typography>
                    Duration: {assessment.duration_minutes} minutes
                  </Typography>
                </Box>
                
                <Box className={classes.assessmentInfoItem}>
                  <CheckCircleOutlineIcon />
                  <Typography>
                    Total Marks: {assessment.total_marks}
                  </Typography>
                </Box>
                
                {activeTab === 2 && (
                  <Box className={classes.assessmentInfoItem}>
                    <ErrorOutlineIcon />
                    <Typography>
                      Attempts: {assessment.total_attempts || 1}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {activeTab === 2 && assessment.best_score !== undefined && (
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
                        value={assessment.best_percentage || 0}
                        size={120}
                        thickness={5}
                        sx={{
                          color: assessment.overall_status === 'Passed' ? '#4caf50' : '#ff9800',
                        }}
                      />
                      <Box className={classes.circularProgressLabel}>
                        {assessment.best_percentage?.toFixed(1) || 0}%
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {assessment.overall_status}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Best Score: {assessment.best_score} / {assessment.total_marks}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
        
        {activeTab === 2 && assessment.attempts && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Attempt History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {assessment.attempts.map((attempt, index) => (
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
                            Submitted: {formatDate(attempt.submitted_at)}
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
        <Button onClick={onClose}>Close</Button>
        {(activeTab === 0 || activeTab === 1) && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              onClose();
              onStartAssessment(assessment);
            }}
            endIcon={<ArrowForwardIcon />}
          >
            {activeTab === 0 ? 'Start Assessment' : 'Continue Assessment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentDetailsDialog;