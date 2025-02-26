const mongoose = require('mongoose');

const watchItemSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
    unique: true
  },
  symbol: { 
    type: String, 
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  marketCap: {
    type: Number,
    default: 0
  },
  percentChange24h: {
    type: Number,
    default: 0
  },
  dateCreated: { 
    type: Date, 
    default: Date.now 
  }
});

const WatchItem = mongoose.model('WatchItem', watchItemSchema);

module.exports = WatchItem;