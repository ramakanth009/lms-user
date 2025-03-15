// src/components/career-path/RecommendedProjects.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
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
  noContent: {
    textAlign: 'center',
    padding: '16px',
    color: '#666',
  },
});

const RecommendedProjects = ({ projects = [] }) => {
  const classes = useStyles();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Recommended Projects
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        {projects.map((project, index) => (
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
  );
};

export default RecommendedProjects;