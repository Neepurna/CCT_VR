import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CardActions, Button } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const CoinCard = ({ coin }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(item => item.id === coin.id));
  }, [coin.id]);

  const handleWatchlistToggle = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      const newWatchlist = watchlist.filter(item => item.id !== coin.id);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      setIsInWatchlist(false);
      window.dispatchEvent(new Event('watchlistUpdate'));
    } else {
      watchlist.push(coin);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
      window.dispatchEvent(new Event('watchlistUpdate'));
    }
  };

  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 1,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img 
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
            alt={coin.name}
            style={{ width: 32, height: 32, marginRight: 8 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {coin.name} ({coin.symbol})
          </Typography>
        </Box>
        <Typography sx={{ mb: 1 }}>
          Price: ${coin.quote?.USD?.price?.toFixed(2)}
        </Typography>
        <Typography sx={{ 
          mb: 1,
          color: coin.quote?.USD?.percent_change_24h >= 0 ? '#000000' : '#666666'
        }}>
          24h Change: {coin.quote?.USD?.percent_change_24h >= 0 ? '+' : ''}{coin.quote?.USD?.percent_change_24h?.toFixed(2)}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Market Cap: ${coin.quote?.USD?.market_cap?.toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth
          variant="outlined"
          size="small"
          startIcon={isInWatchlist ? <RemoveCircleOutline /> : <AddCircleOutline />}
          onClick={handleWatchlistToggle}
          color={isInWatchlist ? "error" : "primary"}
          sx={{
            textTransform: 'none',
            borderRadius: 1
          }}
        >
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CoinCard; 