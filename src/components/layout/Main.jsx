import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '../dashboard/Dashboard';
import CareerPath from '../career-path/CareerPath';
import Assessment from '../assessment/Assessment';
import Profile from '../profile/Profile';
import Login from '../auth/Loginlayout';
import { AuthContext } from '../../contexts/AuthContext';
import ProfilePopupManager from '../profile/ProfilePopupManager';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8f9fc',
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
  },
  mainContent: {
    marginLeft: '260px', // Width of the sidebar
    padding: '84px 20px 20px',
    flexGrow: 1,
    transition: 'margin-left 0.3s, width 0.3s',
    width: 'calc(100% - 260px)',
    height:"auto",
  },
  fullWidth: {
    marginLeft: 0,
    width: '100%',
  },
});

const Main = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  // Check if the current route is login
  const isLoginPage = location.pathname === '/login';

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box className={classes.root}>
      {isAuthenticated && <Navbar />}
      <Box className={classes.contentWrapper}>
        {isAuthenticated && <Sidebar />}
        <Box className={isAuthenticated ? classes.mainContent : classes.fullWidth}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career-path" element={<CareerPath />} />
            <Route path="/assessments" element={<Assessment />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          
          {/* Add the profile popup manager */}
          {isAuthenticated && <ProfilePopupManager />}
        </Box>
      </Box>
    </Box>
  );
};

export default Main;