import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Alert,
  Slide,
  Fade,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Deck as DeckIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../contexts/AuthContext";

// Using a unique color palette (not departmentColors or primaryColors)
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #7E57C2 0%, #B39DDB 100%)", // Purple gradient
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
  },
  leftSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffff",
  },
  rightSection: {
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
  welcomeText: {
    fontSize: "36px !important",
    fontWeight: "bold !important",
    marginBottom: "20px !important",
    color: "white !important",
    textAlign: "center !important",
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
        fontSize: "24px !important",
        backgroundColor: "rgba(255, 255, 255, 0.2) !important",
        padding: "8px !important",
        borderRadius: "50% !important",
      },
    },
  },
  forgotPassword: {
    color: "#7E57C2 !important",
    textDecoration: "none !important",
    fontWeight: "500 !important",
    "&:hover": {
      textDecoration: "underline !important",
    },
  },
  brandName: {
    fontSize: "28px !important",
    fontWeight: "bold !important",
    color: "#7E57C2 !important",
    marginBottom: "30px !important",
    position: "relative !important",
    display: "inline-block !important",
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
  decorativeShape: {
    position: "absolute !important",
    borderRadius: "50% !important",
    background: "linear-gradient(45deg, rgba(126, 87, 194, 0.4), rgba(179, 157, 219, 0.4)) !important",
    filter: "blur(60px) !important",
  },
  checkboxLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px !important",
    },
    "& .MuiCheckbox-root.Mui-checked": {
      color: "#7E57C2 !important",
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

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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
      // Using the student login endpoint from the API documentation
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

  // Features list with animations
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
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Paper className={classes.paper}>
            <Box className={classes.leftSection}>
              <Typography className={classes.brandName}>
                <span>Gigaversity</span>
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight="600">
                Welcome Back!
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Please sign in to continue your learning journey
              </Typography>

              <form className={classes.form} onSubmit={handleSubmit}>
                {error && (
                  <Slide direction="right" in={Boolean(error)}>
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

                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    className={classes.checkboxLabel}
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="#" className={classes.forgotPassword}>
                    Forgot Password?
                  </Link>
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

            <Box className={classes.rightSection}>
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
                <Fade in={showSignup}>
                  <Box className={classes.adminContact}>
                    <Typography className={classes.adminContactTitle}>
                      Want to Join Gigaversity?
                    </Typography>
                    <Typography className={classes.adminContactText}>
                      Please contact our administrative team to create your student account.
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
                      onClick={() => setShowSignup(false)}
                    >
                      Back to Login
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;