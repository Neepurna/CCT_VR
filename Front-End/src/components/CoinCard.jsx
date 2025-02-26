import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Button, Snackbar, Alert, Avatar, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:5000/api/watchlist';

const CoinCard = ({ coin }) => {
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const coinData = {
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.quote?.USD?.price || 0,
        imageUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        marketCap: coin.quote?.USD?.market_cap || 0,
        percentChange24h: coin.quote?.USD?.percent_change_24h || 0
      };

      await axios.post(API_URL, coinData);
      setAddedToWatchlist(true);
      setOpenSnackbar(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Already in watchlist');
      } else {
        setError('Failed to add to watchlist: ' + (err.response?.data?.message || err.message));
      }
      setOpenSnackbar(true);
      console.error('Error adding to watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const price = coin.quote?.USD?.price || 0;
  const percentChange = coin.quote?.USD?.percent_change_24h || 0;
  const isPositiveChange = percentChange >= 0;

  return (
    <>
      <Card sx={{ 
        minWidth: 275, 
        margin: '10px',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 3
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`} 
              alt={coin.name}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography variant="h6" component="div">
              {coin.name} ({coin.symbol})
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            ${price.toFixed(2)}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: isPositiveChange ? 'green' : 'red',
              mb: 2
            }}
          >
            24h: {isPositiveChange ? '+' : ''}{percentChange.toFixed(2)}%
          </Typography>
          
          <Button 
            variant="contained" 
            size="small" 
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={handleAddToWatchlist}
            disabled={addedToWatchlist || isLoading}
            sx={{ width: '100%' }}
          >
            {addedToWatchlist ? 'Added to Watchlist' : isLoading ? 'Adding...' : 'Add to Watchlist'}
          </Button>
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || "Added to watchlist successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoinCard;