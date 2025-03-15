import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Deck as DeckIcon,
} from "@mui/icons-material";
import ContactAdmin from "./ContactAdmin";

// Merged styles directly into this file (previously in styles.login.jsx)
const useStyles = makeStyles({
  leftSection: {
    flex: 1,
    background: "linear-gradient(135deg, rgba(126, 87, 194, 0.9) 0%, rgba(179, 157, 219, 0.9) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    color: "white",
    position: "relative",
    overflow: "hidden",
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
  welcomeText: {
    fontSize: "40px !important", // Increased font size
    fontWeight: "bold !important",
    marginBottom: "20px !important",
    color: "white !important",
    textAlign: "center !important",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2) !important", // Added text shadow
  },
  featureList: {
    marginTop: "30px !important",
    listStyle: "none !important",
    padding: "0 !important",
    width: "100% !important",
    "& li": {
      marginBottom: "20px !important",
      display: "flex !important",
      alignItems: "center !important",
      fontSize: "16px !important",
      padding: "10px 15px !important",
      borderRadius: "10px !important",
      transition: "transform 0.3s ease, background-color 0.3s ease !important",
      backgroundColor: "rgba(255, 255, 255, 0.1) !important",
      "&:hover": {
        transform: "translateX(5px) !important",
        backgroundColor: "rgba(255, 255, 255, 0.2) !important",
      },
      "& .MuiSvgIcon-root": {
        marginRight: "15px !important",
        fontSize: "42px !important", // Increased font size
        backgroundColor: "rgba(255, 255, 255, 0.2) !important",
        padding: "8px !important",
        borderRadius: "50% !important",
      },
    },
  },
  featureAnimation: {
    animation: "$pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
});

const LeftSection = ({ showSignup, setShowSignup }) => {
  const classes = useStyles();

  const features = [
    {
      icon: <SchoolIcon />,
      text: "Access personalized learning resources for your career path",
    },
    {
      icon: <AssessmentIcon />,
      text: "Complete assessments to track your progress",
    },
    {
      icon: <TimelineIcon />,
      text: "View your performance metrics and improvement areas",
    },
    {
      icon: <DeckIcon />,
      text: "Access curriculum designed by industry experts",
    },
  ];

  return (
    <Box className={classes.leftSection}>
      {!showSignup ? (
        <>
          <Typography className={classes.welcomeText}>
            Student Learning Portal
          </Typography>
          <ul className={classes.featureList}>
            {features.map((feature, index) => (
              <Fade 
                in={true} 
                style={{ transitionDelay: `${index * 200}ms` }}
                key={index}
              >
                <li className={index === 0 ? classes.featureAnimation : ""}>
                  {feature.icon}
                  <span>{feature.text}</span>
                </li>
              </Fade>
            ))}
          </ul>
        </>
      ) : (
        <ContactAdmin setShowSignup={setShowSignup} />
      )}
    </Box>
  );
};

export default LeftSection;