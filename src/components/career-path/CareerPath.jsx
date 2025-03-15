// src/components/career-path/CareerPath.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Import our newly created components
import RoleInfoSection from './RoleInfoSection';
import CurriculumTabs from './CurriculumTabs';
import AdditionalResources from './AdditionalResources';

const useStyles = makeStyles({
  root: {
    padding: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
});

const CareerPath = () => {
  const classes = useStyles();
  const [careerPathData, setCareerPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch career path data
  useEffect(() => {
    const fetchCareerPath = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        try {
          const response = await axios.get('http://localhost:8000/api/student/my_career_path/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setCareerPathData(response.data.data);
          setError(null);
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.error('Error fetching career path:', error);
        setError('Failed to load career path data. Please try again later.');
        
        // For development/demo purposes, use mock data when API fails
        if (process.env.NODE_ENV === 'development') {
          const mockData = {
            preferred_role: 'software_developer',
            curriculum: [
              {
                id: 2,
                title: 'Full Stack Web Development',
                description: 'Comprehensive course covering modern web development stack',
                content: {
                  modules: [
                    {
                      name: 'Frontend Fundamentals',
                      topics: [
                        'HTML5 & CSS3 Basics',
                        'JavaScript ES6+',
                        'React.js Fundamentals',
                        'State Management with Redux',
                        'Responsive Design Principles'
                      ]
                    },
                    {
                      name: 'Backend Development',
                      topics: [
                        'Node.js Basics',
                        'Express.js Framework',
                        'RESTful API Design',
                        'Database Integration',
                        'Authentication & Authorization'
                      ]
                    },
                    {
                      name: 'DevOps & Deployment',
                      topics: [
                        'Git Version Control',
                        'Docker Containerization',
                        'CI/CD Pipelines',
                        'Cloud Deployment (AWS)',
                        'Monitoring & Logging'
                      ]
                    }
                  ],
                  recommended_projects: [
                    'Personal Portfolio Website',
                    'E-commerce Platform',
                    'Social Media Dashboard',
                    'Real-time Chat Application'
                  ]
                },
                file_url: 'https://example.com/curriculum/webdev.pdf'
              }
            ],
            progress_percentage: 45
          };
          
          setCareerPathData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCareerPath();
  }, []);

  if (loading) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Career Path
          </Typography>
        </Box>
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error && !careerPathData) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Career Path
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!careerPathData) {
    return (
      <Box className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h4" fontWeight="500">
            Career Path
          </Typography>
        </Box>
        <Alert severity="info">
          No career path data available. Please complete your profile to get a personalized career path.
        </Alert>
      </Box>
    );
  }

  // Extract data from careerPathData
  const { preferred_role, curriculum } = careerPathData;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          Career Path
        </Typography>
      </Box>
      
      {/* Role and Progress Overview */}
      <RoleInfoSection preferredRole={preferred_role} />
      
      {/* Curriculum Content */}
      <CurriculumTabs curriculum={curriculum} />
      
      {/* Additional Resources */}
      <AdditionalResources preferredRole={preferred_role} />
    </Box>
  );
};

export default CareerPath;