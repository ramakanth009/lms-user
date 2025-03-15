// src/components/dashboard/LatestPerformanceReport.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Grid, 
  Divider, 
  Button 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assessment as AssessmentIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: '8px',
      color: '#7E57C2',
    },
  },
  chipSuccess: {
    backgroundColor: '#4caf50 !important',
    color: 'white !important',
  },
  chipWarning: {
    backgroundColor: '#ff9800 !important',
    color: 'white !important',
  },
  cardAction: {
    marginTop: 'auto',
    textAlign: 'right',
    paddingTop: '16px',
  },
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

// Format strengths and improvement areas as arrays
const formatBulletPoints = (text) => {
  if (!text) return [];
  return text.split('\n').filter(item => item.trim() !== '');
};

const LatestPerformanceReport = ({ report }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // If no report is available
  if (!report) {
    return (
      <Paper className={classes.paper} sx={{ mb: 3 }}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Latest Performance Report
        </Typography>
        <Box className={classes.noContent}>
          <Typography variant="body1">
            No performance reports available yet.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Extract report data
  const {
    assessment_title,
    performance_grade,
    overall_performance,
    strengths,
    improvement_areas,
    key_skill_focus
  } = report;

  return (
    <Paper className={classes.paper} sx={{ mb: 3 }}>
      <Typography variant="h6" className={classes.sectionTitle}>
        <AssessmentIcon /> Latest Performance Report
      </Typography>
      
      <Box>
        <Typography variant="h6">
          {assessment_title}
        </Typography>
        <Box display="flex" alignItems="center" my={1}>
          <Chip 
            label={`Grade: ${performance_grade}`}
            className={performance_grade.startsWith('A') || performance_grade.startsWith('B') ? classes.chipSuccess : classes.chipWarning}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`Score: ${overall_performance.toFixed(1)}%`}
            variant="outlined"
            size="small"
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              Strengths:
            </Typography>
            <List dense>
              {formatBulletPoints(strengths).map((strength, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemAvatar sx={{ minWidth: '32px' }}>
                    <StarIcon fontSize="small" color="primary" />
                  </ListItemAvatar>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              Areas for Improvement:
            </Typography>
            <List dense>
              {formatBulletPoints(improvement_areas).map((area, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemAvatar sx={{ minWidth: '32px' }}>
                    <ArrowUpIcon fontSize="small" color="secondary" />
                  </ListItemAvatar>
                  <ListItemText primary={area} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        
        <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
          <Typography variant="subtitle2" gutterBottom>
            Key Skill to Focus On:
          </Typography>
          <Typography variant="body1" fontWeight="500">
            {key_skill_focus}
          </Typography>
        </Box>
        
        <Box className={classes.cardAction}>
          <Button 
            variant="outlined" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/assessments?tab=completed')}
          >
            View All Reports
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default LatestPerformanceReport;