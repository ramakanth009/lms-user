// src/components/dashboard/StatCard.jsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '20px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1) !important',
    },
  },
  iconContainer: {
    position: 'absolute',
    right: '-10px',
    bottom: '-10px',
    opacity: '0.08',
    fontSize: '100px',
    transform: 'rotate(-5deg)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '12px',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
});

const StatCard = ({ title, value, icon, color = '#7E57C2' }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={2}>
      <Box className={classes.content}>
        <Typography className={classes.title} variant="body2">
          {title}
        </Typography>
        <Typography className={classes.value} style={{ color }}>
          {value}
        </Typography>
      </Box>
      <Box className={classes.iconContainer} style={{ color }}>
        {icon}
      </Box>
    </Paper>
  );
};

export default StatCard;