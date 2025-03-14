import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Slide, Alert, InputAdornment, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import axios from "axios";

const useStyles = makeStyles({
  rightSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff",
  },
  brandName: {
    fontSize: "32px !important", // Increased font size
    fontWeight: "bold !important",
    color: "#7E57C2 !important",
    marginBottom: "30px !important",
    position: "relative !important",
    display: "inline-block !important",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2) !important", // Added text shadow
    "& span": {
      position: "relative !important",
      zIndex: "1 !important",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-6px",
      left: "0",
      width: "50%",
      height: "4px",
      backgroundColor: "#E1BEE7",
      borderRadius: "2px",
    },
  },
  form: {
    width: "100%",
    marginTop: "20px",
    "& .MuiTextField-root": {
      marginBottom: "20px",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#7E57C2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#7E57C2",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#7E57C2",
    },
  },
  submitButton: {
    marginTop: "20px",
    background: "#7E57C2 !important",
    color: "white !important",
    padding: "12px !important",
    borderRadius: "10px !important",
    fontWeight: "600 !important",
    fontSize: "1rem !important",
    textTransform: "none !important",
    boxShadow: "0 4px 10px rgba(126, 87, 194, 0.3) !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      background: "#6A1B9A !important",
      boxShadow: "0 6px 15px rgba(126, 87, 194, 0.4) !important",
      transform: "translateY(-2px) !important",
    },
  },
  forgotPassword: {
    color: "#7E57C2 !important",
    fontWeight: "600 !important",
    cursor: "pointer !important",
    "&:hover": {
      textDecoration: "underline !important",
    },
  },
  createAccount: {
    color: "#7E57C2 !important",
    fontWeight: "600 !important",
    cursor: "pointer !important",
    "&:hover": {
      textDecoration: "underline !important",
    },
  },
});

const RightSection = ({ showSignup, setShowSignup, setShowForgotPassword, setIsAuthenticated, navigate }) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "rememberMe" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/student/login/", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("isAuthenticated", "true");
        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.detail ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.rightSection}>
      <Typography className={classes.brandName}>
        <span>Gigaversity</span>
      </Typography>
      <Typography variant="h5" gutterBottom fontWeight="600">
        Welcome Back Genius!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Please sign in to continue your learning journey
      </Typography>

      <form className={classes.form} onSubmit={handleSubmit}>
        {error && (
          <Slide direction="left" in={Boolean(error)}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Slide>
        )}

        <TextField
          className={classes.textField}
          fullWidth
          name="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#7E57C2" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          className={classes.textField}
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#7E57C2" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Grid container justifyContent="flex-end" alignItems="center">
          <span 
            className={classes.forgotPassword}
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </span>
        </Grid>

        <Button
          className={classes.submitButton}
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          disableElevation
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{" "}
            <span 
              className={classes.createAccount}
              onClick={() => setShowSignup(true)}
            >
              Contact Admin
            </span>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default RightSection;
