const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');
const User = require('../models/User');

/**
 * @desc    Create a new store (Tenant)
 * @route   POST /api/stores
 * @access  Private (Vendor only)
 */
const createStore = asyncHandler(async (req, res) => {
  const { name, slug, description, contactEmail } = req.body;

  // 1. Verify the user doesn't already own a store (assuming 1 store per vendor for now)
  const existingStore = await Store.findOne({ ownerId: req.user._id });
  if (existingStore) {
    res.status(400);
    throw new Error('You already have a store created on this account.');
  }

  // 2. Check if the requested slug is already taken (Slugs must be globally unique across the platform)
  const slugExists = await Store.findOne({ slug });
  if (slugExists) {
    res.status(400);
    throw new Error('That store URL (slug) is already taken. Please choose another.');
  }

  // 3. Create the store
  const store = await Store.create({
    ownerId: req.user._id,
    name,
    slug,
    description,
    contactEmail: contactEmail || req.user.email, // Default to user email if not provided
  });

  if (store) {
    res.status(201).json(store);
  } else {
    res.status(400);
    throw new Error('Invalid store data');
  }
});

/**
 * @desc    Get the current vendor's store profile
 * @route   GET /api/stores/my-store
 * @access  Private (Vendor only)
 */
const getMyStore = asyncHandler(async (req, res) => {
  // Find the store that belongs to the currently logged-in user
  const store = await Store.findOne({ ownerId: req.user._id });

  if (store) {
    res.json(store);
  } else {
    res.status(404);
    throw new Error('Store not found. Please create one.');
  }
});

/**
 * @desc    Get a store by its public slug (for the customer storefront)
 * @route   GET /api/stores/:slug
 * @access  Public
 */
const getStoreBySlug = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug, isActive: true });

  if (store) {
    // Exclude sensitive internal data if necessary, though the model is fairly safe
    res.json(store);
  } else {
    res.status(404);
    throw new Error('Store not found or is currently inactive.');
  }
});

module.exports = {
  createStore,
  getMyStore,
  getStoreBySlug,
};