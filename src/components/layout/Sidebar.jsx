import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Collapse,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  ExpandLess,
  ExpandMore,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Timeline as TimelineIcon,
  PersonOutline as PersonIcon,
  Bookmark as BookmarkIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto',
    position: 'fixed',
    bottom: 0,
    left: 0,
    top: '64px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  sidebarItem: {
    padding: '10px 16px',
    margin: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(126, 87, 194, 0.08)',
      cursor: 'pointer',
    },
  },
  sectionTitle: {
    padding: '16px 16px 8px',
    color: '#666666',
    fontWeight: '500',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  activeTab: {
    backgroundColor: 'rgba(126, 87, 194, 0.12)',
    '& .MuiListItemIcon-root': {
      color: '#7E57C2',
    },
    '& .MuiListItemText-primary': {
      color: '#7E57C2',
      fontWeight: '600',
    },
    '&:hover': {
      backgroundColor: 'rgba(126, 87, 194, 0.12)',
    },
  },
  nestedItem: {
    padding: '8px 16px 8px 48px',
    margin: '2px 8px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(126, 87, 194, 0.08)',
      cursor: 'pointer',
    },
  },
  userSection: {
    padding: '16px',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto',
  },
  userIcon: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
    color: '#7E57C2',
    padding: '8px',
    borderRadius: '50%',
    marginRight: '12px',
  },
  userName: {
    fontWeight: '500',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#666',
  },
  iconRoot: {
    minWidth: '40px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(126, 87, 194, 0.12)',
    color: '#7E57C2',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '1px 6px',
    borderRadius: '10px',
    marginLeft: '8px',
  },
});

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleAssessmentClick = () => {
    setAssessmentOpen(!assessmentOpen);
  };

  // Main menu items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      id: 'career-path',
      label: 'Career Path',
      icon: <SchoolIcon />,
      path: '/career-path',
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: <AssignmentIcon />,
      path: '/assessments',
      hasSubmenu: true,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <PersonIcon />,
      path: '/profile',
    },
  ];

  // Assessment submenu items
  const assessmentItems = [
    {
      id: 'pending-assessments',
      label: 'Pending',
      path: '/assessments?tab=pending',
    },
    {
      id: 'completed-assessments',
      label: 'Completed',
      path: '/assessments?tab=completed',
    },
  ];

  return (
    <Paper className={classes.sidebar} elevation={0}>
      <Box className={classes.sidebarContent}>
        <Typography className={classes.sectionTitle}>
          Main
        </Typography>
        
        <List component="nav" disablePadding>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                button
                className={`${classes.sidebarItem} ${
                  (location.pathname === item.path || 
                   (item.id === 'assessments' && location.pathname.startsWith('/assessments'))) 
                    ? classes.activeTab : ''
                }`}
                onClick={item.hasSubmenu ? handleAssessmentClick : () => handleTabClick(item.path)}
              >
                <ListItemIcon classes={{ root: classes.iconRoot }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.id === 'assessments' && (
                  assessmentOpen ? <ExpandLess /> : <ExpandMore />
                )}
                {item.id === 'assessments' && (
                  <span className={classes.badge}>2</span>
                )}
              </ListItem>
              
              {item.id === 'assessments' && (
                <Collapse in={assessmentOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {assessmentItems.map((subItem) => (
                      <ListItem
                        key={subItem.id}
                        button
                        className={`${classes.nestedItem} ${
                          location.pathname + location.search === subItem.path ? classes.activeTab : ''
                        }`}
                        onClick={() => handleTabClick(subItem.path)}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
              
            </React.Fragment>
          ))}
        </List>
        
        {/* <Typography className={classes.sectionTitle} style={{ marginTop: '16px' }}>
          Resources
        </Typography>
        
        <List component="nav" disablePadding>
          <ListItem button className={classes.sidebarItem}>
            <ListItemIcon classes={{ root: classes.iconRoot }}>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Learning Materials" />
          </ListItem>
          
          <ListItem button className={classes.sidebarItem}>
            <ListItemIcon classes={{ root: classes.iconRoot }}>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText primary="Saved Content" />
          </ListItem>
          
          <ListItem button className={classes.sidebarItem}>
            <ListItemIcon classes={{ root: classes.iconRoot }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>
        </List> */}
      </Box>
      
      {/* User section at the bottom */}
      <Box className={classes.userSection}>
        <Box className={classes.userIcon}>
          <PersonIcon fontSize="small" />
        </Box>
        <Box>
          <Typography className={classes.userName}>
            Student User
          </Typography>
          <Typography className={classes.userRole}>
            Software Developer
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Sidebar;