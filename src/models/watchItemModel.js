const mongoose = require('mongoose');

const watchItemSchema = new mongoose.Schema({
  symbol: { 
    type: String, 
    required: true,
    unique: true 
  },
  dateCreated: { 
    type: Date, 
    default: Date.now 
  }
});

const WatchItem = mongoose.model('WatchItem', watchItemSchema);

module.exports = WatchItem;