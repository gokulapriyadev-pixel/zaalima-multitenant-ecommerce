const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Store = require('../models/Store');

const createProduct = asyncHandler(async (req, res) => {
  const {
    storeId,
    categoryId,
    name,
    slug,
    description,
    price,
    inventoryCount,
    images,
    isPublished
  } = req.body;

  if (!storeId || !name || !slug || !description || price === undefined) {
    res.status(400);
    throw new Error('Store, name, slug, description and price are required');
  }

  const store = await Store.findOne({
    _id: storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error('Store not found or you are not the owner');
  }

  const product = await Product.create({
    storeId,
    categoryId,
    name,
    slug,
    description,
    price,
    inventoryCount: inventoryCount || 0,
    images: images || [],
    isPublished: isPublished || false
  });

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    product
  });
});

module.exports = {
  createProduct
};