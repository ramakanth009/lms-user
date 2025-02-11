import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Container>
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 4
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Gigaversity
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your learning journey begins here
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;