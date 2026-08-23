const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');

const createStore = asyncHandler(async (req, res) => {
  const { name, slug, description, logoUrl, themeColors, contactEmail } = req.body;

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

module.exports = {
  createStore
};