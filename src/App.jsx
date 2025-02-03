import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import CryptoDashboard from './components/CryptoDashboard';
import Watchlist from './components/Watchlist';
import WelcomePage from './components/WelcomePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#404040',
      dark: '#000000',
    },
    secondary: {
      main: '#666666',
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Navigation />
                  <Box sx={{ flex: 1, padding: '24px 0' }}>
                    <CryptoDashboard />
                  </Box>
                </>
              }
            />
            <Route
              path="/watchlist"
              element={
                <>
                  <Navigation />
                  <Box sx={{ flex: 1, padding: '24px 0' }}>
                    <Watchlist />
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
