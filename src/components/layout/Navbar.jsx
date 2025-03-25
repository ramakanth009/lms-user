// src/components/layout/Navbar.jsx (Updated with helper and storage utilities)
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import NotificationBadge from '../../components/ui/NotificationBadge';
import AuthService from '../../services/auth';
// Import helper and storage utilities
import { getInitials } from '../../utils/helper';
import StorageService from '../../services/storage';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#7E57C2 !important', // Purple theme
    boxShadow: '0 2px 8px rgba(0,0,0,0.15) !important',
    zIndex: '1201 !important',
  },
  toolbar: {
    display: 'flex !important',
    justifyContent: 'space-between !important',
    padding: '0 20px !important',
    minHeight: '64px !important',
  },
  logo: {
    color: '#ffffff !important',
    fontWeight: '600 !important',
    fontSize: '1.5rem !important',
    letterSpacing: '0.5px !important',
  },
  search: {
    position: 'relative !important',
    borderRadius: '8px !important',
    backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25) !important',
    },
    marginRight: '16px !important',
    width: '300px !important',
    transition: 'all 0.3s ease !important',
    '@media (max-width: 768px)': {
      width: '200px !important',
    },
  },
  searchIcon: {
    padding: '0 16px !important',
    height: '100% !important',
    position: 'absolute !important',
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    color: '#ffffff !important',
  },
  inputRoot: {
    color: '#ffffff !important',
    width: '100% !important',
  },
  inputInput: {
    padding: '10px 10px 10px 48px !important',
    width: '100% !important',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7) !important',
      opacity: 1,
    },
  },
  profileSection: {
    display: 'flex !important',
    alignItems: 'center !important',
    cursor: 'pointer !important',
    padding: '4px 8px !important',
    borderRadius: '8px !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
    },
  },
  avatar: {
    backgroundColor: '#5E35B1 !important',
    marginRight: '8px !important',
  },
  userName: {
    color: '#ffffff !important',
    marginRight: '4px !important',
    fontWeight: '500 !important',
  },
  dropdownIcon: {
    color: '#ffffff !important',
  },
  menuItem: {
    padding: '10px 16px !important',
    display: 'flex !important',
    alignItems: 'center !important',
    gap: '10px !important',
    minWidth: '180px !important',
  },
  loggingOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  loggingOutText: {
    color: '#fff',
    marginLeft: '10px',
  },
});

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      handleClose();
      
      // Call the logout function from AuthContext
      const result = await logout();
      
      if (result.success) {
        // Navigate to login
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const userInitial = getInitials(user?.name || user?.email || '');

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.logo}>
            Gigaversity
          </Typography>

          <Paper component="form" className={classes.search}>
            <Box className={classes.searchIcon}>
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search courses, assessments..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </Paper>

          <Box display="flex" alignItems="center">
            <NotificationBadge />
            
            <Box 
              className={classes.profileSection}
              onClick={handleProfileClick}
            >
              <Avatar className={classes.avatar}>{userInitial}</Avatar>
              <Typography className={classes.userName}>
                {user?.name || 'Student'}
              </Typography>
              <KeyboardArrowDown className={classes.dropdownIcon} />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfile} className={classes.menuItem}>
                <PersonIcon fontSize="small" />
                My Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} className={classes.menuItem} sx={{ color: '#f44336' }}>
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Logging out overlay */}
      {loggingOut && (
        <Box className={classes.loggingOutOverlay}>
          <CircularProgress size={24} color="inherit" />
          <Typography variant="body1" className={classes.loggingOutText}>
            Logging out...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Navbar;