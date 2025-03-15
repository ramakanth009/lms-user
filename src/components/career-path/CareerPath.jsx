// src/components/career-path/CareerPath.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  BookmarkBorder as BookmarkIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  ExpandLess as ExpandLessIcon,
  Subject as SubjectIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import CurriculumCard from './CurriculumCard';
import RoleProgress from './RoleProgress';

// Merged styles directly into this file (previously in styles.careerpath.jsx)
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
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  progressContainer: {
    marginBottom: '24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  curriculumCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  cardContent: {
    flexGrow: 1,
  },
  roleIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#7E57C2',
  },
  roleContainer: {
    textAlign: 'center',
    padding: '24px',
  },
  roleName: {
    fontWeight: '600',
    marginBottom: '8px',
  },
  tabs: {
    marginBottom: '24px',
  },
  moduleContainer: {
    marginTop: '24px',
  },
  moduleTitle: {
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '8px',
      color: '#7E57C2',
    },
  },
  topicItem: {
    paddingLeft: '32px',
  },
  projectItem: {
    marginTop: '8px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  projectTitle: {
    fontWeight: '600',
    marginBottom: '8px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#7E57C2',
      color: 'white',
    },
  },
  accordion: {
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:before': {
      display: 'none',
    },
  },
  accordionSummary: {
    '& .MuiAccordionSummary-content': {
      margin: '12px 0',
    },
  },
  moduleIcon: {
    marginRight: '12px',
    color: '#7E57C2',
  },
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

// Map role names to icons
const getRoleIcon = (role) => {
  const roleIcons = {
    'software_developer': <CodeIcon />,
    'web_developer': <LanguageIcon />,
    'data_scientist': <StorageIcon />,
    'cybersecurity_analyst': <SecurityIcon />,
    // Add more role mappings as needed
  };
  
  return roleIcons[role] || <SchoolIcon />;
};

// Map module names to icons
const getModuleIcon = (moduleName) => {
  const lowerName = moduleName.toLowerCase();
  
  if (lowerName.includes('front') || lowerName.includes('ui')) return <LanguageIcon />;
  if (lowerName.includes('back') || lowerName.includes('api')) return <StorageIcon />;
  if (lowerName.includes('dev') || lowerName.includes('ci')) return <ConstructionIcon />;
  
  // Default icon
  return <SubjectIcon />;
};

const CareerPath = () => {
  const classes = useStyles();
  const [careerPathData, setCareerPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedModules, setExpandedModules] = useState({});

  // Fetch career path data
  useEffect(() => {
    const fetchCareerPath = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/student/my_career_path/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setCareerPathData(response.data.data);
        
        // Initialize expanded state for all modules
        if (response.data.data?.curriculum && response.data.data.curriculum.length > 0) {
          const modulesState = {};
          response.data.data.curriculum.forEach((curriculum) => {
            if (curriculum.content && curriculum.content.modules) {
              curriculum.content.modules.forEach((module, index) => {
                modulesState[`${curriculum.id}-${index}`] = false;
              });
            }
          });
          setExpandedModules(modulesState);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching career path:', error);
        setError('Failed to load career path data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareerPath();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleModule = (curriculumId, moduleIndex) => {
    const moduleKey = `${curriculumId}-${moduleIndex}`;
    setExpandedModules(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  // Format role name for display
  const formatRoleName = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to render curriculum content
  const renderCurriculumContent = (curriculum) => {
    if (!curriculum.content) {
      return (
        <Box className={classes.noContent}>
          <Typography variant="body1">
            No curriculum content available.
          </Typography>
        </Box>
      );
    }

    const { modules = [], recommended_projects = [] } = curriculum.content;

    return (
      <>
        <Box className={classes.moduleContainer}>
          <Typography variant="h6" gutterBottom>
            Modules
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {modules.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No modules available for this curriculum.
            </Typography>
          ) : (
            modules.map((module, moduleIndex) => (
              <Accordion 
                key={moduleIndex}
                className={classes.accordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.accordionSummary}
                >
                  <Box display="flex" alignItems="center">
                    <Box className={classes.moduleIcon}>
                      {getModuleIcon(module.name)}
                    </Box>
                    <Typography variant="subtitle1" className={classes.moduleTitle}>
                      {module.name}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense disablePadding>
                    {module.topics.map((topic, topicIndex) => (
                      <ListItem key={topicIndex} className={classes.topicItem}>
                        <ListItemIcon>
                          <CheckCircleIcon color="disabled" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={topic} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {recommended_projects && recommended_projects.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Recommended Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {recommended_projects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className={classes.projectItem}>
                    <CardContent>
                      <Typography className={classes.projectTitle}>
                        {project}
                      </Typography>
                      <Chip label="Project" size="small" className={classes.chip} />
                      <Chip label="Hands-on" size="small" className={classes.chip} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </>
    );
  };

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

  if (error) {
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
        <Paper className={classes.paper}>
          <Typography variant="h6">No career path data available</Typography>
          <Typography variant="body1">
            Please complete your profile to get a personalized career path.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" fontWeight="500">
          Career Path
        </Typography>
      </Box>
      
      {/* Role and Progress Overview */}
      <Paper className={classes.paper}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box className={classes.roleContainer}>
              <Box className={classes.roleIcon}>
                {getRoleIcon(careerPathData.preferred_role)}
              </Box>
              <Typography variant="h5" className={classes.roleName}>
                {formatRoleName(careerPathData.preferred_role)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Your chosen career path
              </Typography>
              <Chip 
                label="In Progress" 
                color="primary" 
                variant="outlined" 
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <RoleProgress />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Curriculum Tabs and Content */}
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Learning Curriculum
        </Typography>
        <Typography variant="body1" paragraph>
          Your personalized learning path includes the following curriculum designed to help you become a successful {formatRoleName(careerPathData.preferred_role)}.
        </Typography>
        
        {careerPathData.curriculum && careerPathData.curriculum.length > 0 ? (
          <>
            {careerPathData.curriculum.length > 1 ? (
              <>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  className={classes.tabs}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {careerPathData.curriculum.map((item, index) => (
                    <Tab 
                      key={index}
                      label={item.title} 
                      icon={<BookmarkIcon />}
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
                
                {careerPathData.curriculum.map((curriculum, index) => (
                  <Box key={index} hidden={activeTab !== index}>
                    {activeTab === index && (
                      <>
                        <Box mb={3}>
                          <Typography variant="h6" gutterBottom>
                            {curriculum.title}
                          </Typography>
                          <Typography variant="body1">
                            {curriculum.description}
                          </Typography>
                        </Box>
                        <Divider />
                        {renderCurriculumContent(curriculum)}
                      </>
                    )}
                  </Box>
                ))}
              </>
            ) : (
              // Single curriculum display without tabs
              <>
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    {careerPathData.curriculum[0].title}
                  </Typography>
                  <Typography variant="body1">
                    {careerPathData.curriculum[0].description}
                  </Typography>
                </Box>
                <Divider />
                {renderCurriculumContent(careerPathData.curriculum[0])}
              </>
            )}
          </>
        ) : (
          <Box className={classes.noContent}>
            <Typography variant="body1">
              No curriculum items available for your career path.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Career Resources */}
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Additional Resources
        </Typography>
        <Typography variant="body1" paragraph>
          Enhance your skills with these recommended resources for becoming a {formatRoleName(careerPathData.preferred_role)}.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CurriculumCard 
              title="Industry Certifications"
              description="Recommended certifications to boost your credentials in this field."
              icon={<AssignmentIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CurriculumCard 
              title="Sample Projects"
              description="Build these projects to demonstrate your skills to potential employers."
              icon={<ConstructionIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CurriculumCard 
              title="Mentorship Program"
              description="Connect with industry professionals in your chosen career field."
              icon={<SchoolIcon />}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CareerPath;