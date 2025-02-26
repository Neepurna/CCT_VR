const express = require('express');
const watchlist = require('../utils/watchlist');

const router = express.Router();

// GET request to fetch all watchlist items
router.get('/api/watchlist', async (req, res) => {
  try {
    const items = await watchlist.getItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST request to add an item to watchlist
router.post('/api/watchlist', async (req, res) => {
  const { symbol } = req.body;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const newItem = await watchlist.addItem(symbol);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE request to remove an item from watchlist
router.delete('/api/watchlist/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const isDeleted = await watchlist.removeItem(id);
    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item not found in watchlist' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;