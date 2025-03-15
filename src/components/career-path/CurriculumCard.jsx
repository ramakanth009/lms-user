// src/components/career-path/CurriculumCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  BookmarkBorder as BookmarkIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    '&:hover $actions': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  cardContent: {
    padding: '24px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    color: '#7E57C2',
  },
  title: {
    fontWeight: '600',
    marginBottom: '8px',
  },
  description: {
    color: '#666',
    marginBottom: '16px',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 'auto',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    padding: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    transform: 'translateY(100%)',
    opacity: 0,
    transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
  },
  bookmarkButton: {
    color: '#7E57C2',
  },
  viewButton: {
    textTransform: 'none',
  },
  progressIndicator: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '12px',
  },
  progressText: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '8px',
  },
});

const CurriculumCard = ({ 
  title, 
  description, 
  icon, 
  tags = ['Recommended'], 
  progress = 0,
  onBookmark,
  onView,
  url,
}) => {
  const classes = useStyles();

  const handleBookmark = (event) => {
    if (onBookmark) {
      event.stopPropagation();
      onBookmark();
    }
  };

  const handleView = (event) => {
    if (onView) {
      event.stopPropagation();
      onView();
    } else if (url) {
      event.stopPropagation();
      window.open(url, '_blank');
    }
  };

  return (
    <Card className={classes.card} elevation={2}>
      <CardContent className={classes.cardContent}>
        <Box className={classes.iconContainer}>
          {icon}
        </Box>
        
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        
        <Typography variant="body2" className={classes.description}>
          {description}
        </Typography>
        
        <Box className={classes.chipContainer}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              className={classes.chip}
              variant="outlined"
            />
          ))}
        </Box>
        
        {progress > 0 && (
          <Box className={classes.progressIndicator}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
              color="primary"
            />
            <Typography className={classes.progressText}>
              {progress}% Complete
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <Box className={classes.actions}>
        <IconButton 
          className={classes.bookmarkButton} 
          size="small"
          onClick={handleBookmark}
        >
          <BookmarkIcon />
        </IconButton>
        
        <Button
          className={classes.viewButton}
          size="small"
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          onClick={handleView}
        >
          View Resource
        </Button>
      </Box>
    </Card>
  );
};

export default CurriculumCard;