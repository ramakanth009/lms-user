// src/components/auth/Loginlayout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Container, Paper, Fade } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "../../contexts/AuthContext";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import ContactAdmin from "./ContactAdmin";
import ForgotPassword from "./ForgotPassword";

// Merged styles directly into this file (previously in styles.login.jsx)
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%)", // Reversed purple gradient
    padding: "20px",
    overflow: "hidden",
    position: "relative",
  },
  paper: {
    display: "flex",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    maxWidth: "1000px",
    width: "100%",
    minHeight: "600px",
    position: "relative",
    zIndex: 1,
    transform: "rotateY(0deg)",
    transformStyle: "preserve-3d",
    perspective: "1000px",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "50%",
      background: "#ffffff",
      boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: -1,
    },
    "&::before": {
      left: 0,
      transform: "rotateY(-15deg)",
      transformOrigin: "left center",
    },
    "&::after": {
      right: 0,
      transform: "rotateY(15deg)",
      transformOrigin: "right center",
    },
  },
  decorativeShape: {
    position: "absolute !important",
    borderRadius: "50% !important",
    background: "linear-gradient(45deg, rgba(126, 87, 194, 0.4), rgba(179, 157, 219, 0.4)) !important",
    filter: "blur(60px) !important",
  },
});

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Box className={classes.root}>
      {/* Decorative shapes for background */}
      <Box 
        className={classes.decorativeShape} 
        sx={{
          width: '400px',
          height: '400px',
          top: '-100px',
          right: '-100px',
        }}
      />
      <Box 
        className={classes.decorativeShape} 
        sx={{
          width: '300px',
          height: '300px',
          bottom: '50px',
          left: '10%',
        }}
      />
      
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Fade in={true} timeout={1000}>
          <Paper className={classes.paper}>
            {showForgotPassword ? (
              <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
            ) : (
              <>
                <LeftSection showSignup={showSignup} setShowSignup={setShowSignup} />
                <RightSection 
                  showSignup={showSignup} 
                  setShowSignup={setShowSignup} 
                  setShowForgotPassword={setShowForgotPassword} 
                  setIsAuthenticated={setIsAuthenticated} 
                  navigate={navigate} 
                />
              </>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;