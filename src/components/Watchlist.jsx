import { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import CoinCard from './CoinCard';

const Watchlist = () => {
  const [watchlistCoins, setWatchlistCoins] = useState([]);

  const handleStorageChange = () => {
    const coins = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlistCoins(coins);
  };

  useEffect(() => {
    // Initial load
    handleStorageChange();

    // Listen for custom watchlist update event
    window.addEventListener('watchlistUpdate', handleStorageChange);
    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('watchlistUpdate', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Box 
      component="main"
      sx={{ 
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8f9fa',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ 
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ width: '100%', p: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              textAlign: 'center',
              color: '#2196F3',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Your Watchlist
          </Typography>
        </Box>
        <Box sx={{ flex: 1, px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            {watchlistCoins.length === 0 ? (
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textAlign: 'center', 
                    color: 'text.secondary',
                    mt: 4
                  }}
                >
                  No coins in your watchlist yet
                </Typography>
              </Grid>
            ) : (
              watchlistCoins.map(coin => (
                <Grid item xs={12} sm={6} lg={4} key={coin.id}>
                  <CoinCard coin={coin} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Watchlist; 