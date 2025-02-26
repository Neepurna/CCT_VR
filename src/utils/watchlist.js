const WatchItem = require('../models/watchItemModel');

// Custom node module to manage watchlist operations
const watchlist = {
  // Get all items from the watchlist
  getItems: async () => {
    try {
      return await WatchItem.find({}).sort({ dateCreated: -1 });
    } catch (error) {
      throw new Error(`Error getting watchlist items: ${error.message}`);
    }
  },

  // Add a new item to the watchlist
  addItem: async (symbol) => {
    try {
      // Check if item already exists
      const existingItem = await WatchItem.findOne({ symbol });
      if (existingItem) {
        return existingItem;
      }
      
      // Create and save new item
      const item = new WatchItem({ symbol });
      await item.save();
      return item;
    } catch (error) {
      throw new Error(`Error adding item to watchlist: ${error.message}`);
    }
  },

  // Remove an item from the watchlist
  removeItem: async (symbol) => {
    try {
      const result = await WatchItem.deleteOne({ symbol });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Error removing item from watchlist: ${error.message}`);
    }
  }
};

module.exports = watchlist;