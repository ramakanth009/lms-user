// src/components/dashboard/ActivityFeed.jsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  Done as DoneIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';

// Merged styles directly into this file
const useStyles = makeStyles({
  root: {
    width: '100%',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '4px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#B39DDB',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#7E57C2',
    },
  },
  listItem: {
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  activityTitle: {
    fontWeight: '500',
  },
  activityTime: {
    fontSize: '0.75rem',
    color: '#666',
  },
  assessmentIcon: {
    backgroundColor: '#7E57C2 !important',
  },
  curriculumIcon: {
    backgroundColor: '#4caf50 !important',
  },
  profileIcon: {
    backgroundColor: '#2196f3 !important',
  },
  notificationIcon: {
    backgroundColor: '#ff9800 !important',
  },
  emptyFeed: {
    padding: '32px',
    textAlign: 'center',
    color: '#666',
  },
});

const ActivityFeed = ({ activities = [] }) => {
  const classes = useStyles();

  // Function to get the icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'assessment_completed':
      case 'assessment_added':
      case 'assessment_evaluation':
        return <AssessmentIcon />;
      case 'curriculum_added':
      case 'curriculum_updated':
        return <BookIcon />;
      case 'profile_created':
      case 'profile_updated':
      case 'profile_update_request':
      case 'profile_update_permission':
        return <PersonIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  // Function to get the avatar background color based on activity type
  const getAvatarClass = (type) => {
    if (type.includes('assessment')) return classes.assessmentIcon;
    if (type.includes('curriculum')) return classes.curriculumIcon;
    if (type.includes('profile')) return classes.profileIcon;
    return classes.notificationIcon;
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Box className={classes.emptyFeed}>
        <Typography variant="body1">
          No recent activity to display.
        </Typography>
      </Box>
    );
  }

  return (
    <List className={classes.root} disablePadding>
      {activities.map((activity) => (
        <ListItem key={activity.id} className={classes.listItem} disablePadding>
          <ListItemAvatar>
            <Avatar className={getAvatarClass(activity.type)}>
              {getActivityIcon(activity.type)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="body1" className={classes.activityTitle}>
                {activity.title}
              </Typography>
            }
            secondary={
              <>
                <Typography variant="body2" component="span" display="block">
                  {activity.description}
                </Typography>
                <Typography variant="caption" className={classes.activityTime}>
                  {formatDate(activity.date)}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityFeed;