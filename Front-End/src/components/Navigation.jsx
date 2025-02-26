import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Crypto Tracker
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dashboard"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/watchlist"
            startIcon={<ListAltIcon />}
          >
            Watchlist
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/gameplay"
            startIcon={<VideogameAssetIcon />}
          >
            Immersive
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;