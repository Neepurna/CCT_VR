const WatchItem = require('../models/watchItemModel');


const getAllWatchlistItems = async () => {
  try {
    const items = await WatchItem.find({}).sort({ dateCreated: -1 });
    return items;
  } catch (error) {
    console.error('Error fetching watchlist items:', error);
    throw error;
  }
};


const addToWatchlist = async (coinData) => {
  try {
    const existingItem = await WatchItem.findOne({ coinId: coinData.coinId });
    
    if (existingItem) {
      return { success: false, message: 'Coin already in watchlist' };
    }
    
    const newItem = new WatchItem({
      symbol: coinData.symbol,
      coinId: coinData.coinId,
      name: coinData.name,
      price: coinData.price,
      imageUrl: coinData.imageUrl,
      marketCap: coinData.marketCap,
      percentChange24h: coinData.percentChange24h
    });
    
    await newItem.save();
    return { success: true, data: newItem };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};


const removeFromWatchlist = async (coinId) => {
  try {
    const result = await WatchItem.findOneAndDelete({ coinId });
    
    if (!result) {
      return { success: false, message: 'Coin not found in watchlist' };
    }
    
    return { success: true, message: 'Coin removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};


const updateWatchlistItem = async (coinId, updatedData) => {
  try {
    const existingItem = await WatchItem.findOne({ coinId });
    
    if (!existingItem) {
      return { success: false, message: 'Coin not found in watchlist' };
    }
    
    const updatedItem = await WatchItem.findOneAndUpdate(
      { coinId },
      { $set: updatedData },
      { new: true }
    );
    
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    throw error;
  }
};

module.exports = {
  getAllWatchlistItems,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem
};