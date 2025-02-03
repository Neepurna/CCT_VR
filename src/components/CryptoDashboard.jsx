import { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import SearchPanel from './SearchPanel';
import CoinCard from './CoinCard';

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
          headers: {
            'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY,
          },
        });
        setCoins(response.data.data);
        setFilteredCoins(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  if (loading) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

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
              color: '#000000',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Crypto Coin Tracker
          </Typography>
          <SearchPanel onSearch={handleSearch} />
        </Box>
        <Box sx={{ flex: 1, px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            {filteredCoins.map(coin => (
              <Grid item xs={12} sm={6} lg={4} key={coin.id}>
                <CoinCard coin={coin} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CryptoDashboard;