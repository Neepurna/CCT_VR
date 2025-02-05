import { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import SearchPanel from './SearchPanel';
import CoinCard from './CoinCard';

function CryptoDashboard() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCoins = async () => {
      try {
        const apiKey = import.meta.env.VITE_CMC_API_KEY;
        if (!apiKey) {
          console.error('API key is not defined');
          return;
        }

        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
          headers: {
            'X-CMC_PRO_API_KEY': apiKey,
          },
          params: {
            limit: 100,
            convert: 'USD'
          }
        });

        if (response.data && response.data.data) {
          setCoins(response.data.data);
          setFilteredCoins(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    getCoins();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  if (loading) {
    return <CircularProgress style={{ margin: '20px auto', display: 'block' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ textAlign: 'center', margin: '20px 0' }}>
        Crypto Coin Tracker
      </Typography>
      <SearchPanel onSearch={handleSearch} />
      <Grid container spacing={3}>
        {filteredCoins.map(coin => (
          <Grid item xs={12} sm={6} md={4} key={coin.id}>
            <CoinCard coin={coin} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CryptoDashboard;