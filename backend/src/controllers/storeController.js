const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');
const Cart = require('../models/Cart');


// ==========================================
// CREATE STORE
// POST /api/stores
// Access: Private
// ==========================================

const createStore = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    logoUrl,
    themeColors,
    contactEmail
  } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error('Store name and slug are required');
  }

  // One store per vendor
  const existingOwnerStore = await Store.findOne({
    ownerId: req.user._id
  });

  if (existingOwnerStore) {
    res.status(400);
    throw new Error(
      'You already have a store created on this account.'
    );
  }

  // Store slug must be globally unique
  const existingStore = await Store.findOne({ slug });

  if (existingStore) {
    res.status(400);
    throw new Error('Store slug already exists');
  }

  const store = await Store.create({
    ownerId: req.user._id,
    name,
    slug,
    description,
    logoUrl,
    themeColors,
    contactEmail: contactEmail || req.user.email
  });

  res.status(201).json({
    status: 'success',
    message: 'Store created successfully',
    store
  });
});


// ==========================================
// GET MY STORES
// GET /api/stores
// Access: Private
// ==========================================

const getMyStores = asyncHandler(async (req, res) => {

  const stores = await Store.find({
    ownerId: req.user._id
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: stores.length,
    stores
  });
});


// ==========================================
// GET MY STORE
// GET /api/stores/my-store
// Access: Private
// ==========================================

const getMyStore = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error(
      'Store not found. Please create one.'
    );
  }

  res.status(200).json({
    status: 'success',
    store
  });
});


// ==========================================
// GET STORE BY ID
// GET /api/stores/:id
// Access: Private
// ==========================================

const getStoreById = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  res.status(200).json({
    status: 'success',
    store
  });
});


// ==========================================
// GET STORE BY SLUG
// GET /api/stores/:slug
// Access: Public
// ==========================================

const getStoreBySlug = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    slug: req.params.slug,
    isActive: true
  });

  if (!store) {
    res.status(404);
    throw new Error(
      'Store not found or is currently inactive.'
    );
  }

  res.status(200).json({
    status: 'success',
    store
  });
});


// ==========================================
// UPDATE STORE
// PUT /api/stores/:id
// Access: Private
// ==========================================

const updateStore = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  const {
    name,
    slug,
    description,
    logoUrl,
    themeColors,
    contactEmail,
    isActive
  } = req.body;

  // Check slug uniqueness
  if (slug && slug !== store.slug) {

    const existingStore = await Store.findOne({
      slug,
      _id: { $ne: store._id }
    });

    if (existingStore) {
      res.status(400);
      throw new Error('Store slug already exists');
    }

    store.slug = slug;
  }

  if (name !== undefined) {
    store.name = name;
  }

  if (description !== undefined) {
    store.description = description;
  }

  if (logoUrl !== undefined) {
    store.logoUrl = logoUrl;
  }

  if (themeColors !== undefined) {
    store.themeColors = themeColors;
  }

  if (contactEmail !== undefined) {
    store.contactEmail = contactEmail;
  }

  if (isActive !== undefined) {
    store.isActive = isActive;
  }

  const updatedStore = await store.save();

  res.status(200).json({
    status: 'success',
    message: 'Store updated successfully',
    store: updatedStore
  });
});


// ==========================================
// DELETE STORE
// DELETE /api/stores/:id
// Access: Private
// ==========================================

const deleteStore = asyncHandler(async (req, res) => {

  const store = await Store.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error('Store not found');
  }

  // Delete associated carts
  await Cart.deleteMany({
    storeId: store._id
  });

  await store.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Store deleted successfully'
  });
});

// ==========================================
// GET PUBLIC STORES
// GET /api/stores/public
// Access: Public
// ==========================================

const getPublicStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({
    isActive: true
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: stores.length,
    stores
  });
});


module.exports = {
  createStore,
  getMyStores,
  getMyStore,
  getStoreById,
  getStoreBySlug,
  getPublicStores,
  updateStore,
  deleteStore
};
