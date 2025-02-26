const express = require('express');
const router = express.Router();
const { getAllWatchlistItems, addToWatchlist, removeFromWatchlist } = require('../utils/watchlist');

// Get all watchlist items
router.get('/', async (req, res) => {
  try {
    const items = await getAllWatchlistItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a coin to watchlist
router.post('/', async (req, res) => {
  try {
    const result = await addToWatchlist(req.body);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.status(201).json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a coin from watchlist
router.delete('/:coinId', async (req, res) => {
  try {
    const result = await removeFromWatchlist(req.params.coinId);
    
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }
    
    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;