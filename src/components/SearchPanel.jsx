import { TextField } from '@mui/material';

function SearchPanel({ onSearch }) {
  return (
    <div style={{ margin: '20px auto', maxWidth: '500px' }}>
      <TextField
        fullWidth
        placeholder="Search coins..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
}

export default SearchPanel;