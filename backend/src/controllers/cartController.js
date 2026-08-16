const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get the customer's cart for a specific store
 * @route   GET /api/cart/:storeId
 * @access  Private (Customer)
 */
const getCart = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  // Find the cart and populate product details (name, price, images)
  let cart = await Cart.findOne({ customerId: req.user._id, storeId })
    .populate('items.productId', 'name price images inventoryCount');

  // If no cart exists, return an empty cart object
  if (!cart) {
    return res.json({ items: [], total: 0 });
  }

  res.json(cart);
});

/**
 * @desc    Add an item to the cart (or increase quantity)
 * @route   POST /api/cart
 * @access  Private (Customer)
 */
const addToCart = asyncHandler(async (req, res) => {
  const { storeId, productId, quantity } = req.body;
  const addedQuantity = Number(quantity) || 1;

  // 1. Verify product exists and belongs to the specified store
  const product = await Product.findOne({ _id: productId, storeId });
  if (!product) {
    res.status(404);
    throw new Error('Product not found in this store');
  }

  // 2. Find or create the user's cart for this store
  let cart = await Cart.findOne({ customerId: req.user._id, storeId });

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = await Cart.create({
      customerId: req.user._id,
      storeId,
      items: [{ productId, quantity: addedQuantity }]
    });
  } else {
    // 3. If cart exists, check if product is already in it
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
        // Product exists, increment quantity
        cart.items[itemIndex].quantity += addedQuantity;
    } else {
        // Product does not exist, push new item
        cart.items.push({ productId, quantity: addedQuantity });
    }
    await cart.save();
  }

  // Return the updated cart with populated product data
  const updatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price images inventoryCount');
  res.status(200).json(updatedCart);
});

/**
 * @desc    Update specific item quantity in cart
 * @route   PUT /api/cart/:storeId/item/:productId
 * @access  Private (Customer)
 */
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { storeId, productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1. Use remove endpoint to delete items.');
  }

  const cart = await Cart.findOne({ customerId: req.user._id, storeId });
    
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  const updatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price images inventoryCount');
  res.status(200).json(updatedCart);
});

/**
 * @desc    Remove a specific item from the cart
 * @route   DELETE /api/cart/:storeId/item/:productId
 * @access  Private (Customer)
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const { storeId, productId } = req.params;

  const cart = await Cart.findOne({ customerId: req.user._id, storeId });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Filter out the item that matches the productId
  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.productId', 'name price images inventoryCount');
  res.status(200).json(updatedCart);
});

/**
 * @desc    Clear the entire cart for a store
 * @route   DELETE /api/cart/:storeId/clear
 * @access  Private (Customer)
 */
const clearCart = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const cart = await Cart.findOne({ customerId: req.user._id, storeId });

  if (!cart) {
    return res.status(200).json({ message: 'Cart is already empty', items: [] });
  }

  cart.items = []
  await cart.save();

  res.status(200).json({ message: 'Cart cleared successfully', items: [] });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
};