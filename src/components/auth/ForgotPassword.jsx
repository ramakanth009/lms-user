import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Email as EmailIcon, Person as PersonIcon } from "@mui/icons-material";

// Merged styles directly into this file (previously in styles.login.jsx)
const useStyles = makeStyles({
  adminContact: {
    backgroundColor: "rgba(255, 255, 255, 0.15) !important",
    backdropFilter: "blur(10px) !important",
    padding: "30px !important",
    borderRadius: "15px !important",
    textAlign: "center !important",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1) !important",
    width: "80% !important",
  },
  adminContactTitle: {
    fontSize: "28px !important",
    fontWeight: "bold !important",
    marginBottom: "20px !important",
  },
  adminContactText: {
    fontSize: "16px !important",
    marginBottom: "24px !important",
  },
  adminContactInfo: {
    fontSize: "18px !important",
    fontWeight: "500 !important",
    marginBottom: "8px !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    "& .MuiSvgIcon-root": {
      marginRight: "10px !important",
    },
  },
});

const ForgotPassword = ({ setShowForgotPassword }) => {
  const classes = useStyles();

  return (
    <Box className={classes.adminContact}>
      <Typography className={classes.adminContactTitle}>
        Forgot Your Password?
      </Typography>
      <Typography className={classes.adminContactText}>
        Please contact our administrative team to reset your password.
      </Typography>
      <Typography className={classes.adminContactInfo}>
        <EmailIcon /> admin@gigaversity.com
      </Typography>
      <Typography className={classes.adminContactInfo}>
        <PersonIcon /> +1 (555) 123-4567
      </Typography>
      <Button 
        variant="outlined" 
        color="inherit" 
        sx={{ mt: 2, borderColor: 'white', borderRadius: '10px' }}
        onClick={() => setShowForgotPassword(false)}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;