import { Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchPanel = ({ onSearch }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '600px', 
      mx: 'auto',
      mb: 3
    }}>
      <TextField
        fullWidth
        placeholder="Search Cryptocurrencies"
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          ),
        }}
        sx={{
          backgroundColor: 'white',
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            borderColor: '#e0e0e0',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 14px',
          },
        }}
      />
    </Box>
  );
};

export default SearchPanel; 