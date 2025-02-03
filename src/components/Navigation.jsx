import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#000000',
        boxShadow: 'none',
        width: '100%',
        left: 0
      }}
    >
      <Toolbar 
        sx={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          minHeight: '64px'
        }}
      >
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1.25rem'
          }}
        >
          Crypto Tracker
        </Typography>
        <Box sx={{ display: 'flex', ml: 4 }}>
          <Button
            component={Link}
            to="/dashboard"
            sx={{
              color: 'white',
              fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/watchlist"
            sx={{
              color: 'white',
              fontWeight: location.pathname === '/watchlist' ? 'bold' : 'normal',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Watchlist
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 