const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const WatchlistItem = mongoose.model('WatchlistItem', watchlistItemSchema);

module.exports = WatchlistItem;
