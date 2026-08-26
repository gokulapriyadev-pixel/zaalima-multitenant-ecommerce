const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Order = require('../models/Order');
const { uploadImage } = require('../services/cloudinaryService');

/**
 * @desc    Get the logged-in vendor's Store ID
 * @helper  Internal helper to prevent redundant queries
 */
const getVendorStoreId = async (userId) => {
  const store = await Store.findOne({ ownerId: userId });
  if (!store) {
    throw new Error('You must create a store before managing products or categories.');
  }
  return store._id;
};

// ==========================================
// CATEGORY CONTROLLERS
// ==========================================

/**
 * @desc    Create a new category for the vendor's store
 * @route   POST /api/categories
 * @access  Private (Vendor only)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const storeId = await getVendorStoreId(req.user._id);

  // Mongoose compound index handles duplicate slugs per store, 
  // but this gives a cleaner error message.
  const categoryExists = await Category.findOne({ storeId, slug });
  if (categoryExists) {
    res.status(400);
    throw new Error('A category with this slug already exists in your store.');
  }

  const category = await Category.create({
    storeId,
    name,
    slug
  });

  res.status(201).json(category);
});

/**
 * @desc    Get all categories for a specific store (Public storefront)
 * @route   GET /api/categories/:storeId
 * @access  Public
 */
const getStoreCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ storeId: req.params.storeId });
  res.json(categories);
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/products/categories/:categoryId
 * @access  Private (Vendor)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const storeId = await getVendorStoreId(req.user._id);
    
  // Safety check: Prevent deleting categories that still have products
  const productsInCategory = await Product.countDocuments({ 
    categoryId: req.params.categoryId, 
    storeId 
  });

  if (productsInCategory > 0) {
    res.status(400);
    throw new Error('Cannot delete this category because it contains active products. Please delete or reassign the products first.');
  }

  const category = await Category.findOneAndDelete({ 
    _id: req.params.categoryId, 
    storeId 
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found or you do not have permission to delete it.');
  }

  res.json({ message: 'Category removed successfully' });
});

/**
 * @desc    Update a category
 * @route   PUT /api/products/categories/:categoryId
 * @access  Private (Vendor)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const storeId = await getVendorStoreId(req.user._id);

  const category = await Category.findOne({ _id: req.params.categoryId, storeId });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // If they are changing the slug, ensure the new slug isn't already taken
  if (slug && slug !== category.slug) {
    const slugTaken = await Category.findOne({ storeId, slug });
    if (slugTaken) {
      res.status(400);
      throw new Error('This slug is already used by another category.');
    }
  }

  category.name = name || category.name;
  category.slug = slug || category.slug;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// ==========================================
// PRODUCT CONTROLLERS
// ==========================================

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Vendor only)
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, inventoryCount, categoryId, isPublished } = req.body;
  const storeId = await getVendorStoreId(req.user._id);

  const productExists = await Product.findOne({ storeId, slug });
  if (productExists) {
    res.status(400);
    throw new Error('A product with this URL slug already exists in your store.');
  }

  // Verify category belongs to this store (security check)
  if (categoryId) {
    const category = await Category.findOne({ _id: categoryId, storeId });
    if (!category) {
      res.status(400);
      throw new Error('Invalid category ID for this store.');
    }
  }

  const product = await Product.create({
    storeId,
    categoryId,
    name,
    slug,
    description,
    price,
    images: images || [],
    inventoryCount: inventoryCount || 0,
    isPublished: isPublished !== undefined ? isPublished : false
  });

  res.status(201).json(product);
});

/**
 * @desc    Get all products for a specific store (Public storefront)
 * @route   GET /api/products/:storeId
 * @access  Public
 */
const getStoreProducts = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
    
  // 1. Grab query parameters (defaults: page 1, 10 items per page)
  const { keyword, categoryId, pageNumber, pageSize, minPrice, maxPrice, sort } = req.query;
  const page = Number(pageNumber) || 1;
  const limit = Number(pageSize) || 10;
  const skip = (page - 1) * limit;

  // 2. Build the base query (Only show published products for this store)
  const query = { storeId, isPublished: true };

  // 3. Search: If keyword exists, search product name OR description (case-insensitive)
  if (keyword) {
    query.$or = [
    { name: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } }
    ];
  }

  // 4. Filter: If categoryId is provided, filter by that category
  if (categoryId) {
    query.categoryId = categoryId;
  }

  // Price Filtering Logic
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting Logic
  let sortOption = { createdAt: -1 }; // Default: Newest first
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'top_rated') sortOption = { rating: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  // 5. Count total matching documents (before applying pagination limit)
  const count = await Product.countDocuments(query);

  // 6. Fetch paginated results
  const products = await Product.find(query)
    .populate('categoryId', 'name slug')
    .sort(sortOption) // Dynamic sort option 
    .limit(limit)
    .skip(skip);

  // 7. Return products alongside pagination metadata
  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    totalProducts: count
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:productId
 * @access  Private (Vendor)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const storeId = await getVendorStoreId(req.user._id);
    
  const product = await Product.findOneAndDelete({ 
    _id: req.params.productId, 
    storeId 
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found or you do not have permission to delete it.');
  }

  res.json({ message: 'Product removed successfully' });
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:productId
 * @access  Private (Vendor)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const storeId = await getVendorStoreId(req.user._id);
  const product = await Product.findOne({ _id: req.params.productId, storeId });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // If changing slug, verify uniqueness
  if (req.body.slug && req.body.slug !== product.slug) {
    const slugExists = await Product.findOne({ storeId, slug: req.body.slug });
    if (slugExists) {
      res.status(400);
      throw new Error('A product with this URL slug already exists in your store.');
    }
  }

  // If changing category, verify the new category belongs to this store
  if (req.body.categoryId && req.body.categoryId !== product.categoryId?.toString()) {
    const categoryValid = await Category.findOne({ _id: req.body.categoryId, storeId });
    if (!categoryValid) {
      res.status(400);
      throw new Error('Invalid category ID for this store.');
    }
  }

  product.name = req.body.name || product.name;
  product.slug = req.body.slug || product.slug;
  product.description = req.body.description || product.description;
  product.categoryId = req.body.categoryId || product.categoryId;
    
  // Check for undefined explicitly because 0 and false are valid values
  if (req.body.price !== undefined) product.price = req.body.price;
  if (req.body.inventoryCount !== undefined) product.inventoryCount = req.body.inventoryCount;
  if (req.body.isPublished !== undefined) product.isPublished = req.body.isPublished;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// ==========================================
// REVIEWS CONTROLLER 
// ==========================================

/**
 * @desc    Create new review for a product
 * @route   POST /api/products/:productId/reviews
 * @access  Private (Logged-in users)
 */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  // 1. Find the product
  const product = await Product.findById(productId);
  if (!product) {
      res.status(404);
      throw new Error('Product not found');
  }

  // 2. Verify the user has actually purchased this product before!
  // We check if an order exists for this customer that includes the product, 
  // and ensuring the order hasn't been cancelled.
  const hasPurchased = await Order.findOne({
      customerId: req.user._id,
      'products.productId': productId,
      orderStatus: { $ne: 'cancelled' } 
  });

  if (!hasPurchased) {
      res.status(400);
      throw new Error('You can only review products you have purchased.');
  }

  // 3. Check if they already reviewed this exact product
  const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product.');
  }

  // 4. Create the review object
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  // 5. Add it to the product and recalculate the averages
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review successfully added' });
});

// Upload an image and attach it to a specific product
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
  createCategory,
  getStoreCategories,
  deleteCategory,
  updateCategory,
  createProduct,
  getStoreProducts,
  deleteProduct,
  updateProduct,
  createProductReview,
  uploadProductImage
};