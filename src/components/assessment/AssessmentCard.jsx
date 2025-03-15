// src/components/assessment/AssessmentCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  LinearProgress,
  Divider,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Launch as LaunchIcon,
  PlayArrow as StartIcon,
  Description as DescriptionIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

// Merged styles directly into this file
const useStyles = makeStyles({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
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
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.4',
    minHeight: '50px',
  },
  cardDescription: {
    color: '#666',
    marginBottom: '16px',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardActions: {
    padding: '12px 16px',
    justifyContent: 'space-between',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    '& svg': {
      marginRight: '8px',
      fontSize: '1rem',
      color: '#7E57C2',
    },
  },
  statusChip: {
    fontWeight: '500',
  },
  viewButton: {
    marginRight: '8px',
  },
  progressContainer: {
    marginTop: '16px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
  },
  bestScore: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  pendingScore: {
    fontWeight: 'bold',
    color: '#ff9800',
  },
});

const AssessmentCard = ({ assessment, status, onOpen, onStart }) => {
  const classes = useStyles();
  
  const renderStatusChip = () => {
    switch (status) {
      case 'pending':
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Pending"
            color="default"
            variant="outlined"
            size="small"
            className={classes.statusChip}
          />
        );
      case 'in_progress':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="In Progress"
            color="warning"
            variant="outlined"
            size="small"
            className={classes.statusChip}
          />
        );
      case 'completed':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label={assessment.overall_status}
            color={assessment.overall_status === 'Passed' ? 'success' : 'warning'}
            variant="outlined"
            size="small"
            className={classes.statusChip}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className={classes.card} elevation={2}>
      <CardContent className={classes.cardContent}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography className={classes.cardTitle} gutterBottom variant="h6" component="h2">
            {assessment.title}
          </Typography>
          {renderStatusChip()}
        </Box>
        
        <Typography className={classes.cardDescription} variant="body2" color="textSecondary" component="p">
          {assessment.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box className={classes.infoRow}>
          <ScheduleIcon fontSize="small" />
          <Typography variant="body2">
            Duration: {assessment.duration_minutes} minutes
          </Typography>
        </Box>
        
        <Box className={classes.infoRow}>
          <DescriptionIcon fontSize="small" />
          <Typography variant="body2">
            Questions: {assessment.questions ? assessment.questions.length : 'N/A'}
          </Typography>
        </Box>
        
        <Box className={classes.infoRow}>
          <CheckCircleIcon fontSize="small" />
          <Typography variant="body2">
            Total Marks: {assessment.total_marks}
          </Typography>
        </Box>
        
        {status === 'in_progress' && assessment.latest_score !== undefined && (
          <Box className={classes.progressContainer}>
            <Box className={classes.progressLabel}>
              <Typography variant="body2">Latest Attempt</Typography>
              <Typography variant="body2" className={classes.pendingScore}>
                {assessment.latest_score}/{assessment.total_marks}
              </Typography>
            </Box>
            <LinearProgress
              className={classes.progressBar}
              variant="determinate"
              value={(assessment.latest_score / assessment.total_marks) * 100}
              color="warning"
            />
          </Box>
        )}
        
        {status === 'completed' && assessment.best_score !== undefined && (
          <Box className={classes.progressContainer}>
            <Box className={classes.progressLabel}>
              <Typography variant="body2">Best Score</Typography>
              <Typography variant="body2" className={classes.bestScore}>
                {assessment.best_score}/{assessment.total_marks}
              </Typography>
            </Box>
            <LinearProgress
              className={classes.progressBar}
              variant="determinate"
              value={(assessment.best_score / assessment.total_marks) * 100}
              color={assessment.overall_status === 'Passed' ? 'success' : 'warning'}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={onOpen}
          className={classes.viewButton}
        >
          View Details
        </Button>
        
        {status === 'pending' && onStart && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<StartIcon />}
            onClick={onStart}
          >
            Start
          </Button>
        )}
        
        {status === 'in_progress' && onStart && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<LaunchIcon />}
            onClick={onStart}
          >
            Continue
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AssessmentCard;