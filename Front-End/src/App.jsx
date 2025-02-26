import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import CryptoDashboard from './components/CryptoDashboard';
import Watchlist from './components/Watchlist';
import WelcomePage from './components/WelcomePage';
import GameplayBoard from './components/GameplayBoard';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#404040',
      dark: '#000000',
    },
    secondary: {
      main: '#f50057',
      light: '#999999',
      dark: '#333333',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/dashboard" element={<CryptoDashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/gameplay" element={<GameplayBoard />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
