// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// Merged styles directly into this file
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    width: '100%',
  },
  text: {
    marginTop: '16px',
    color: '#666',
  },
});

const LoadingSpinner = ({ text = 'Loading...', size = 40 }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CircularProgress size={size} color="primary" />
      {text && (
        <Typography variant="body1" className={classes.text}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;