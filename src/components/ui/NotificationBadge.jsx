// src/components/ui/NotificationBadge.jsx
import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Notifications as NotificationsIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  notificationButton: {
    color: '#ffffff',
  },
  popover: {
    width: '360px',
    maxHeight: '480px',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15) !important',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f5f7fa',
  },
  notificationTitle: {
    fontWeight: 'bold !important',
  },
  markAllBtn: {
    textTransform: 'none !important',
    fontWeight: 'bold !important',
    color: '#7E57C2 !important',
  },
  notificationsList: {
    maxHeight: '400px',
    overflow: 'auto',
    padding: 0,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: '3px',
    },
  },
  notificationItem: {
    padding: '12px 16px !important',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f5f7fa',
    },
  },
  unreadNotification: {
    borderLeft: '3px solid #7E57C2',
    backgroundColor: 'rgba(126, 87, 194, 0.05)',
  },
  notificationTitleText: {
    fontWeight: 'bold !important',
    fontSize: '14px !important',
    color: '#1a1a1a',
    marginBottom: '4px !important',
  },
  notificationMessage: {
    fontSize: '13px !important',
    color: '#666666',
    marginBottom: '4px !important',
    display: '-webkit-box !important',
    '-webkit-line-clamp': '2 !important',
    '-webkit-box-orient': 'vertical !important',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis !important',
  },
  notificationTime: {
    fontSize: '12px !important',
    color: '#999999',
  },
  emptyMessage: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#666666',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#F06292 !important',
      color: 'white !important',
    },
  },
  notificationTypeTag: {
    display: 'inline-block !important',
    fontSize: '10px !important',
    fontWeight: 'bold !important',
    padding: '2px 6px !important',
    borderRadius: '10px !important',
    marginTop: '4px !important',
    backgroundColor: '#E1BEE7 !important',
    color: '#7E57C2 !important',
  },
});

const NotificationBadge = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();
    
    // Set up interval to periodically check for new notifications
    const interval = setInterval(() => {
      if (!anchorEl) { // Only fetch if popover is closed
        fetchNotifications(true); // silent fetch
      }
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when popover opens
  useEffect(() => {
    if (anchorEl) {
      fetchNotifications();
    }
  }, [anchorEl]);

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // In a real app, we would fetch from the API
      /*
      const response = await axios.get('http://localhost:8000/api/student/my_notifications/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
      */
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockNotifications = [
          {
            id: 1,
            title: 'New Assessment Available',
            message: 'A new assessment "JavaScript Fundamentals" has been assigned to you.',
            type: 'assessment_added',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            is_read: false,
          },
          {
            id: 2,
            title: 'Assessment Evaluated',
            message: 'Your assessment "Web Development Fundamentals" has been evaluated. You scored 75%.',
            type: 'assessment_evaluation',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            is_read: false,
          },
          {
            id: 3,
            title: 'Profile Update Request Approved',
            message: 'Your profile update request has been approved. You can update your profile for the next 24 hours.',
            type: 'profile_update_permission',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            is_read: true,
          },
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
        if (!silent) setLoading(false);
      }, silent ? 0 : 500);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (!silent) setLoading(false);
    }
  };

  const handleOpenNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setMarkingAllRead(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // In a real app, we would call the API
      /*
      await axios.post('http://localhost:8000/api/student/mark_all_notifications_read/', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      */
      
      // Mock success for demonstration
      setTimeout(() => {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            is_read: true
          }))
        );
        setUnreadCount(0);
        setMarkingAllRead(false);
      }, 500);
      
    } catch (error) {
      console.error('Error marking all as read:', error);
      setMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // In a real app, we would call the API
      /*
      await axios.post(`http://localhost:8000/api/student/${id}/mark_notification_read/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      */
      
      // Update state without making another API call
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  // Format date for display
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

  // Get notification type display
  const getNotificationTypeDisplay = (type) => {
    const types = {
      'profile_creation': 'Profile',
      'profile_update': 'Profile',
      'profile_update_request': 'Profile Request',
      'profile_update_permission': 'Permission',
      'assessment_added': 'Assessment',
      'assessment_submission': 'Assessment',
      'assessment_evaluation': 'Assessment',
      'student_assignment': 'Assignment',
      'security': 'Security',
    };
    
    return types[type] || 'Notification';
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton 
          className={classes.notificationButton} 
          onClick={handleOpenNotifications}
          size="large"
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            className={classes.badge}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: classes.popover,
        }}
      >
        <Box className={classes.notificationHeader}>
          <Typography variant="subtitle1" className={classes.notificationTitle}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          <Button
            size="small"
            className={classes.markAllBtn}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markingAllRead}
          >
            {markingAllRead ? 'Marking...' : 'Mark all read'}
          </Button>
        </Box>
        
        <Divider />
        
        <List className={classes.notificationsList}>
          {loading ? (
            <Box className={classes.loadingContainer}>
              <CircularProgress size={24} color="primary" />
            </Box>
          ) : notifications.length === 0 ? (
            <Box className={classes.emptyMessage}>
              <Typography variant="body1">
                No notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  className={`${classes.notificationItem} ${!notification.is_read ? classes.unreadNotification : ''}`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography className={classes.notificationTitleText}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography className={classes.notificationMessage}>
                          {notification.message}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography className={classes.notificationTime}>
                            {formatDate(notification.created_at)}
                          </Typography>
                          <Typography className={classes.notificationTypeTag}>
                            {getNotificationTypeDisplay(notification.type)}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBadge;