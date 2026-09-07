const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Store = require('../models/Store');

// ==========================================
// CREATE CATEGORY
// POST /api/categories
// ==========================================
const createCategory = asyncHandler(async (req, res) => {
  const { storeId, name, slug } = req.body;

  if (!storeId || !name || !slug) {
    res.status(400);
    throw new Error('Store, name and slug are required');
  }

  // Make sure the logged-in user owns the store
  const store = await Store.findOne({
    _id: storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error('Store not found or you are not the owner');
  }

  const existingCategory = await Category.findOne({
    storeId,
    slug
  });

  if (existingCategory) {
    res.status(400);
    throw new Error('Category slug already exists in this store');
  }

  const category = await Category.create({
    storeId,
    name,
    slug
  });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    category
  });
});


// ==========================================
// GET MY CATEGORIES
// GET /api/categories
// ==========================================
const getMyCategories = asyncHandler(async (req, res) => {

  const stores = await Store.find({
    ownerId: req.user._id
  }).select('_id');

  const storeIds = stores.map(store => store._id);

  const categories = await Category.find({
    storeId: { $in: storeIds }
  })
    .populate('storeId', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: categories.length,
    categories
  });
});


// ==========================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// ==========================================
const getCategoryById = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id)
    .populate('storeId', 'name slug');

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const store = await Store.findOne({
    _id: category.storeId._id,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to access this category');
  }

  res.status(200).json({
    status: 'success',
    category
  });
});


// ==========================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// ==========================================
const updateCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const store = await Store.findOne({
    _id: category.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to update this category');
  }

  const { name, slug } = req.body;

  if (name !== undefined) {
    category.name = name;
  }

  if (slug !== undefined && slug !== category.slug) {

    const existingCategory = await Category.findOne({
      storeId: category.storeId,
      slug,
      _id: { $ne: category._id }
    });

    if (existingCategory) {
      res.status(400);
      throw new Error('Category slug already exists in this store');
    }

    category.slug = slug;
  }

  const updatedCategory = await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    category: updatedCategory
  });
});


// ==========================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// ==========================================
const deleteCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const store = await Store.findOne({
    _id: category.storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(403);
    throw new Error('You are not authorized to delete this category');
  }

  await category.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully'
  });
});


module.exports = {
  createCategory,
  getMyCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};