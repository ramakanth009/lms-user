// src/components/career-path/ModuleAccordion.jsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Construction as ConstructionIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
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
  topicItem: {
    paddingLeft: '32px',
  },
});

// Map module names to icons
const getModuleIcon = (moduleName) => {
  const lowerName = moduleName.toLowerCase();
  
  if (lowerName.includes('front') || lowerName.includes('ui')) return <LanguageIcon />;
  if (lowerName.includes('back') || lowerName.includes('api')) return <StorageIcon />;
  if (lowerName.includes('dev') || lowerName.includes('ci')) return <ConstructionIcon />;
  
  // Default icon
  return <SubjectIcon />;
};

const ModuleAccordion = ({ modules = [] }) => {
  const classes = useStyles();

  if (!modules || modules.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No modules available for this curriculum.
      </Typography>
    );
  }

  return (
    <>
      {modules.map((module, moduleIndex) => (
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
              <Typography variant="subtitle1">
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
      ))}
    </>
  );
};

export default ModuleAccordion;