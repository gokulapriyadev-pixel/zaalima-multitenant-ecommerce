const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');

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
    contactEmail
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

  // Check slug uniqueness if slug is being changed
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

  if (name !== undefined) store.name = name;
  if (description !== undefined) store.description = description;
  if (logoUrl !== undefined) store.logoUrl = logoUrl;
  if (themeColors !== undefined) store.themeColors = themeColors;
  if (contactEmail !== undefined) store.contactEmail = contactEmail;
  if (isActive !== undefined) store.isActive = isActive;

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

  await store.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Store deleted successfully'
  });
});


module.exports = {
  createStore,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore
};