const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const toggleWishlistItem = asyncHandler(async (req, res) => {
  const { storeId, productId } = req.body;
  const customerId = req.user._id;

  // Find or create the wishlist for this specific store
  let wishlist = await Wishlist.findOne({ customerId, storeId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ customerId, storeId, products: [] });
  }

  // Check if product is already in the wishlist
  const productIndex = wishlist.products.indexOf(productId);

  if (productIndex > -1) {
    // Product exists, remove it
    wishlist.products.splice(productIndex, 1);
  } else {
    // Product doesn't exist, add it
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.status(200).json(wishlist);
});

const getStoreWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({
    customerId: req.user._id,
    storeId: req.params.storeId
  }).populate('products', 'name price images slug');

  res.status(200).json(wishlist || { products: [] });
});

module.exports = { toggleWishlistItem, getStoreWishlist };