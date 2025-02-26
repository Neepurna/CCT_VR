import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, CircularProgress, Pagination } from '@mui/material';
import CoinCard from './CoinCard';

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coinsPerPage = 12;

  useEffect(() => {
    const fetchCoinData = async () => {
      const options = {
        method: 'GET',
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        params: {
          start: 1,
          limit: 100,
          convert: 'USD'
        },
        headers: {
          'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY,
          'Accept': 'application/json'
        },
        proxy: false,
      };

      try {
        setLoading(true);
        // For development, we'll use a proxy to avoid CORS issues
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const response = await axios.request(options);
        const data = response.data.data;
        
        setCoins(data);
        setTotalPages(Math.ceil(data.length / coinsPerPage));
        setLoading(false);
      } catch (error) {
        setError('Error fetching crypto data');
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchCoinData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current coins for pagination
  const indexOfLastCoin = page * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cryptocurrency Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Browse cryptocurrencies and add them to your watchlist
      </Typography>

      <Grid container spacing={3}>
        {currentCoins.map(coin => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={coin.id}>
            <CoinCard coin={coin} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
    </Box>
  );
};

export default CryptoDashboard;