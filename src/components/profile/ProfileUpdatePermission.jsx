import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LockOutlined, EditOutlined, InfoOutlined } from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginTop: '24px',
    border: '1px dashed #ccc',
  },
  lockIcon: {
    marginRight: '8px',
    color: '#f44336',
  },
  editIcon: {
    marginRight: '8px',
    color: '#4caf50',
  },
  infoIcon: {
    marginRight: '8px',
    color: '#1976d2',
  },
  statusText: {
    color: '#666',
    marginBottom: '12px',
  },
  lockInfo: {
    marginTop: '8px',
    color: '#666',
    fontSize: '0.875rem',
  },
  requestButton: {
    marginTop: '16px',
  },
  pendingBadge: {
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    display: 'inline-block',
    marginLeft: '8px',
  },
  approvedBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    display: 'inline-block',
    marginLeft: '8px',
  },
  textField: {
    marginTop: '16px',
  },
  dialogButton: {
    marginLeft: '8px',
  }
});

const ProfileUpdatePermission = ({ 
  canUpdateProfile = false, 
  hasPendingRequest = false,
  onUpdateRequested = () => {},
  timeRemaining = null
}) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setReason('');
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (error) setError('');
  };

  const handleSubmitRequest = async () => {
    // Basic validation
    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters).');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Send the request to the API
      const response = await axios.post(
        'http://localhost:8000/api/student/request_update_permission/',
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Close dialog and show success message
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Update request submitted successfully. You will be notified when approved.',
        severity: 'success'
      });
      
      // Callback to parent component
      if (onUpdateRequested) {
        onUpdateRequested(response.data);
      }
      
    } catch (error) {
      console.error('Error submitting update request:', error);
      setError(error.response?.data?.message || 'Failed to submit request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Format time remaining if provided (in hours)
  const formatTimeRemaining = (hours) => {
    if (hours <= 1) {
      return 'less than 1 hour';
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return days === 1 ? '1 day' : `${days} days`;
    }
  };

  if (canUpdateProfile) {
    return (
      <Paper className={classes.container} elevation={0}>
        <Box display="flex" alignItems="center">
          <EditOutlined className={classes.editIcon} />
          <Typography variant="body2" fontWeight="medium">
            Profile updates enabled
            <span className={classes.approvedBadge}>APPROVED</span>
          </Typography>
        </Box>
        <Typography variant="body2" className={classes.statusText}>
          You can update your profile information now.
          {timeRemaining && (
            <strong> Your edit permission expires in {formatTimeRemaining(timeRemaining)}.</strong>
          )}
        </Typography>
      </Paper>
    );
  }

  if (hasPendingRequest) {
    return (
      <Paper className={classes.container} elevation={0}>
        <Box display="flex" alignItems="center">
          <InfoOutlined className={classes.infoIcon} />
          <Typography variant="body2" fontWeight="medium">
            Profile update request pending
            <span className={classes.pendingBadge}>PENDING</span>
          </Typography>
        </Box>
        <Typography variant="body2" className={classes.statusText}>
          Your request to update your profile is pending approval. You'll receive a notification once it's approved.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper className={classes.container} elevation={0}>
        <Box display="flex" alignItems="center">
          <LockOutlined className={classes.lockIcon} />
          <Typography variant="body2" fontWeight="medium">
            Profile updates are locked
          </Typography>
        </Box>
        <Typography variant="body2" className={classes.lockInfo}>
          You need admin approval to update your profile. Click the "Request Edit Permission" button to submit a request.
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleOpenDialog}
          className={classes.requestButton}
        >
          Request Edit Permission
        </Button>
      </Paper>

      {/* Request Update Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Request Profile Update Permission</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Please provide a reason why you need to update your profile. Your request will be reviewed by an administrator.
          </Typography>
          
          <TextField
            label="Reason for Update"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={reason}
            onChange={handleReasonChange}
            placeholder="Example: I need to update my CGPA and phone number as they have changed recently."
            className={classes.textField}
            error={!!error}
            helperText={error || "Minimum 10 characters required"}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRequest}
            variant="contained" 
            color="primary"
            disabled={loading || reason.trim().length < 10}
            className={classes.dialogButton}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileUpdatePermission;