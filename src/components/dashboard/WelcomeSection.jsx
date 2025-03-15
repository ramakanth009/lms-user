// src/components/dashboard/WelcomeSection.jsx
import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
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
});

const WelcomeSection = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
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
  );
};

export default WelcomeSection;