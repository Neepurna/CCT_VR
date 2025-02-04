import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <AppBar position="static" style={{ backgroundColor: '#333' }}>
      <Toolbar>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button 
            component={Link} 
            to="/" 
            style={{ color: 'white' }}
          >
            Crypto Tracker
          </Button>
          <Button 
            component={Link} 
            to="/dashboard" 
            style={{ color: 'white' }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/watchlist" 
            style={{ color: 'white' }}
          >
            Watchlist
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;