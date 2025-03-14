// src/components/dashboard/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="500">
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Welcome to your student dashboard</Typography>
        <Typography variant="body1">
          This is a placeholder for the dashboard component.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;