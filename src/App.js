// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Main from './components/layout/Main';

// Create a theme with the purple color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#7E57C2',
      light: '#B39DDB',
      dark: '#5E35B1',
    },
    secondary: {
      main: '#F06292',
      light: '#F8BBD0',
      dark: '#E91E63',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Main />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;