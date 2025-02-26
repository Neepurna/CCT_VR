import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

function CoinCard({ coin }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(item => item.id === coin.id));
  }, [coin.id]);

  const handleWatchlistToggle = () => {
    let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      watchlist = watchlist.filter(item => item.id !== coin.id);
    } else {
      watchlist.push(coin);
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    setIsInWatchlist(!isInWatchlist);
    window.dispatchEvent(new Event('watchlistUpdate'));
  };

  return (
    <Card style={{ margin: '10px', padding: '10px' }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img 
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
            alt={coin.name}
            style={{ width: '30px', marginRight: '10px' }}
          />
          <Typography variant="h6">{coin.name} ({coin.symbol})</Typography>
        </div>
        <Typography>Price: ${coin.quote?.USD?.price?.toFixed(2)}</Typography>
        <Typography>24h Change: {coin.quote?.USD?.percent_change_24h?.toFixed(2)}%</Typography>
        <Typography>Market Cap: ${coin.quote?.USD?.market_cap?.toLocaleString()}</Typography>
        <Button 
          variant="contained"
          onClick={handleWatchlistToggle}
          style={{ marginTop: '10px' }}
        >
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CoinCard;