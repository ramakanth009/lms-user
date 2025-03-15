// src/components/ui/LoadingButton.jsx
import React from 'react';
import {
  Button,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// Merged styles directly into this file
const useStyles = makeStyles({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
});

const LoadingButton = ({
  loading,
  startIcon,
  loadingPosition = 'center',
  children,
  disabled,
  ...props
}) => {
  const classes = useStyles();
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading;
  
  // Determine which icon to show
  const buttonIcon = loading && loadingPosition === 'start' ? <CircularProgress size={24} /> : startIcon;
  
  return (
    <div className={classes.buttonWrapper}>
      <Button
        startIcon={buttonIcon}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </Button>
      {loading && loadingPosition === 'center' && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};

export default LoadingButton;