import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_URL = 'http://localhost:5000/api/watchlist';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch watchlist from backend
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setWatchlist(response.data);
    } catch (err) {
      setError('Failed to fetch watchlist: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Remove coin from watchlist
  const handleRemove = async (coinId) => {
    try {
      await axios.delete(`${API_URL}/${coinId}`);
      setWatchlist(watchlist.filter(coin => coin.coinId !== coinId));
    } catch (err) {
      setError('Failed to remove coin: ' + (err.response?.data?.message || err.message));
      console.error('Error removing coin from watchlist:', err);
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    fetchWatchlist();
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          My Watchlist
        </Typography>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading && !refreshing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : watchlist.length === 0 ? (
        <Alert severity="info">Your watchlist is empty. Add coins from the dashboard.</Alert>
      ) : (
        <List>
          {watchlist.map((coin) => (
            <ListItem 
              key={coin.coinId || coin._id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemove(coin.coinId)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                mb: 1,
                background: '#f9f9f9'
              }}
            >
              <ListItemAvatar>
                <Avatar alt={coin.name} src={coin.imageUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={`${coin.name} (${coin.symbol})`}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      ${coin.price?.toFixed(2) || '0.00'} • 
                    </Typography>
                    <Typography 
                      component="span" 
                      variant="body2"
                      sx={{ 
                        color: (coin.percentChange24h || 0) >= 0 ? 'green' : 'red',
                        ml: 1
                      }}
                    >
                      {(coin.percentChange24h || 0) >= 0 ? '+' : ''}
                      {(coin.percentChange24h || 0)?.toFixed(2)}%
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary">
                      Added: {new Date(coin.dateCreated).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Watchlist;