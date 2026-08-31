const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { uploadImage } = require('../services/cloudinaryService');

// ==========================================
// CREATE PRODUCT
// POST /api/products
// ==========================================
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


// ==========================================
// GET MY PRODUCTS
// GET /api/products
// ==========================================
const getMyProducts = asyncHandler(async (req, res) => {
  const stores = await Store.find({
    ownerId: req.user._id
  }).select('_id');

  const storeIds = stores.map(store => store._id);

  const products = await Product.find({
  storeId: { $in: storeIds }
})
  .populate('categoryId', 'name slug')
  .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: products.length,
    products
  });
});


// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==========================================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  .populate('categoryId', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const store = await Store.findOne({
    _id: product.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to access this product');
  }

  res.status(200).json({
    status: 'success',
    product
  });
});


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==========================================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const store = await Store.findOne({
    _id: product.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to update this product');
  }

  const {
    categoryId,
    name,
    slug,
    description,
    price,
    inventoryCount,
    images,
    isPublished
  } = req.body;

  if (slug && slug !== product.slug) {
    const existingProduct = await Product.findOne({
      storeId: product.storeId,
      slug,
      _id: { $ne: product._id }
    });

    if (existingProduct) {
      res.status(400);
      throw new Error('Product slug already exists in this store');
    }

    product.slug = slug;
  }

  if (categoryId !== undefined) product.categoryId = categoryId;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (inventoryCount !== undefined) product.inventoryCount = inventoryCount;
  if (images !== undefined) product.images = images;
  if (isPublished !== undefined) product.isPublished = isPublished;

  const updatedProduct = await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    product: updatedProduct
  });
});


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==========================================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const store = await Store.findOne({
    _id: product.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to delete this product');
  }

  await product.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});


// ==========================================
// UPLOAD PRODUCT IMAGE
// POST /api/products/upload-image
// ==========================================
const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  const result = await uploadImage(
    req.file.buffer,
    'zaalima/products'
  );

  res.status(200).json({
    status: 'success',
    message: 'Product image uploaded successfully',
    imageUrl: result.secure_url,
    publicId: result.public_id
  });
});


module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage
};