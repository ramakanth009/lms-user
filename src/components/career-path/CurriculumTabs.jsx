// src/components/career-path/CurriculumTabs.jsx
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BookmarkBorder as BookmarkIcon } from '@mui/icons-material';
import CurriculumContent from './CurriculumContent';

const useStyles = makeStyles({
  paper: {
    padding: '24px',
    marginBottom: '24px',
  },
  tabs: {
    marginBottom: '24px',
  },
  noContent: {
    textAlign: 'center',
    padding: '32px',
    color: '#666',
  },
});

const CurriculumTabs = ({ curriculum = [] }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!curriculum || curriculum.length === 0) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Learning Curriculum
        </Typography>
        <Typography variant="body1" paragraph>
          No curriculum is available for your career path yet.
        </Typography>
        <Box className={classes.noContent}>
          <Typography variant="body1">
            No curriculum items available for your career path.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>
        Learning Curriculum
      </Typography>
      <Typography variant="body1" paragraph>
        Your personalized learning path includes the following curriculum designed to help you succeed.
      </Typography>
      
      {curriculum.length > 1 ? (
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
            {curriculum.map((item, index) => (
              <Tab 
                key={index}
                label={item.title} 
                icon={<BookmarkIcon />}
                iconPosition="start"
              />
            ))}
          </Tabs>
          
          {curriculum.map((curricItem, index) => (
            <Box key={index} hidden={activeTab !== index}>
              {activeTab === index && <CurriculumContent curriculum={curricItem} />}
            </Box>
          ))}
        </>
      ) : (
        // Single curriculum display without tabs
        <CurriculumContent curriculum={curriculum[0]} />
      )}
    </Paper>
  );
};

export default CurriculumTabs;