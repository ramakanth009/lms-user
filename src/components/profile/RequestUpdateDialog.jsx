// src/components/profile/RequestUpdateDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles({
  unlockMessageField: {
    marginTop: '16px',
  },
});

const RequestUpdateDialog = ({ open, onClose, onSuccess }) => {
  const classes = useStyles();
  const [requestReason, setRequestReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleRequestReasonChange = (e) => {
    setRequestReason(e.target.value);
    // Clear error if user starts typing
    if (error) setError('');
  };

  const handleSubmitRequest = async () => {
    // Basic validation
    if (requestReason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Send the request to the API
      const response = await axios.post(
        'http://localhost:8000/api/student/request_update_permission/',
        { reason: requestReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // On success, call the success callback
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Close the dialog
      handleClose();
    } catch (error) {
      console.error('Error submitting update request:', error);
      setError('Failed to submit update request. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleClose = () => {
    // Reset state
    setRequestReason('');
    setError('');
    // Call parent close handler
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Request Profile Update Permission</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Your profile is currently locked for updates. Please provide a reason why you need to update your profile.
        </Typography>
        <TextField
          label="Reason for Update"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={requestReason}
          onChange={handleRequestReasonChange}
          placeholder="Example: I need to update my CGPA and phone number."
          className={classes.unlockMessageField}
          required
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmitRequest} 
          variant="contained" 
          color="primary"
          disabled={submitting || requestReason.trim().length < 10}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit Request'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestUpdateDialog;