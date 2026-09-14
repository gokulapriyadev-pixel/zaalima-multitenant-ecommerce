const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { uploadImage } = require('../services/cloudinaryService');


// ==========================================
// INTERNAL HELPER
// ==========================================

const getVendorStoreId = async (userId) => {
  const store = await Store.findOne({ ownerId: userId });

  if (!store) {
    throw new Error(
      'You must create a store before managing products.'
    );
  }

  return store._id;
};


// ==========================================
// CREATE PRODUCT
// POST /api/products
// Access: Private
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

  if (
    !storeId ||
    !name ||
    !slug ||
    !description ||
    price === undefined
  ) {
    res.status(400);
    throw new Error(
      'Store, name, slug, description and price are required'
    );
  }

  const store = await Store.findOne({
    _id: storeId,
    ownerId: req.user._id
  });

  if (!store) {
    res.status(404);
    throw new Error(
      'Store not found or you are not the owner'
    );
  }

  // Verify category belongs to this store
  if (categoryId) {
    const category = await Category.findOne({
      _id: categoryId,
      storeId
    });

    if (!category) {
      res.status(400);
      throw new Error(
        'Invalid category ID for this store'
      );
    }
  }

  // Prevent duplicate product slug within the store
  const existingProduct = await Product.findOne({
    storeId,
    slug
  });

  if (existingProduct) {
    res.status(400);
    throw new Error(
      'Product slug already exists in this store'
    );
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
    isPublished: isPublished !== undefined
      ? isPublished
      : false
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
// Access: Private
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
// GET STORE PRODUCTS
// GET /api/products/store/:storeId
// Access: Public
// ==========================================

const getStoreProducts = asyncHandler(async (req, res) => {

  const { storeId } = req.params;

  const {
    keyword,
    categoryId,
    pageNumber,
    pageSize,
    minPrice,
    maxPrice,
    sort
  } = req.query;

  const page = Number(pageNumber) || 1;
  const limit = Number(pageSize) || 10;
  const skip = (page - 1) * limit;

  // Only published products
  const query = {
    storeId,
    isPublished: true
  };

  // Search
  if (keyword) {
    query.$or = [
      {
        name: {
          $regex: keyword,
          $options: 'i'
        }
      },
      {
        description: {
          $regex: keyword,
          $options: 'i'
        }
      }
    ];
  }

  // Category filter
  if (categoryId) {
    query.categoryId = categoryId;
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // Sorting
  let sortOption = {
    createdAt: -1
  };

  if (sort === 'price_asc') {
    sortOption = { price: 1 };
  }

  if (sort === 'price_desc') {
    sortOption = { price: -1 };
  }

  if (sort === 'top_rated') {
    sortOption = { rating: -1 };
  }

  if (sort === 'newest') {
    sortOption = { createdAt: -1 };
  }

  const count = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('categoryId', 'name slug')
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    products,
    page,
    pages: Math.ceil(count / limit),
    totalProducts: count
  });
});


// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// Access: Private
// ==========================================

const getProductById = asyncHandler(async (req, res) => {

  const product = await Product.findOne({
    _id: req.params.id,
    isPublished: true
  })
    .populate('categoryId', 'name slug')
    .populate('storeId', 'name slug logoUrl');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    status: 'success',
    product
  });
});


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// Access: Private
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
    throw new Error(
      'You are not authorized to update this product'
    );
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

  // Validate slug uniqueness
  if (slug && slug !== product.slug) {

    const existingProduct = await Product.findOne({
      storeId: product.storeId,
      slug,
      _id: {
        $ne: product._id
      }
    });

    if (existingProduct) {
      res.status(400);
      throw new Error(
        'Product slug already exists in this store'
      );
    }

    product.slug = slug;
  }

  // Validate category
  if (
    categoryId !== undefined &&
    categoryId !== null &&
    categoryId !== ''
  ) {

    const category = await Category.findOne({
      _id: categoryId,
      storeId: product.storeId
    });

    if (!category) {
      res.status(400);
      throw new Error(
        'Invalid category ID for this store'
      );
    }

    product.categoryId = categoryId;
  }

  if (name !== undefined) {
    product.name = name;
  }

  if (description !== undefined) {
    product.description = description;
  }

  if (price !== undefined) {
    product.price = price;
  }

  if (inventoryCount !== undefined) {
    product.inventoryCount = inventoryCount;
  }

  if (images !== undefined) {
    product.images = images;
  }

  if (isPublished !== undefined) {
    product.isPublished = isPublished;
  }

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
// Access: Private
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
    throw new Error(
      'You are not authorized to delete this product'
    );
  }

  await product.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});


// ==========================================
// CREATE PRODUCT REVIEW
// POST /api/products/:productId/reviews
// Access: Private
// ==========================================

const createProductReview = asyncHandler(async (req, res) => {

  const {
    rating,
    comment
  } = req.body;

  const productId = req.params.productId;

  if (
    rating === undefined ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    res.status(400);
    throw new Error(
      'Rating must be between 1 and 5'
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Verify the user purchased this product
  const hasPurchased = await Order.findOne({
    customerId: req.user._id,
    'products.productId': productId,
    orderStatus: {
      $ne: 'cancelled'
    }
  });

  if (!hasPurchased) {
    res.status(400);
    throw new Error(
      'You can only review products you have purchased.'
    );
  }

  // Prevent duplicate reviews
  const alreadyReviewed =
    product.reviews &&
    product.reviews.find(
      review =>
        review.user.toString() ===
        req.user._id.toString()
    );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error(
      'You have already reviewed this product.'
    );
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id
  };

  if (!product.reviews) {
    product.reviews = [];
  }

  product.reviews.push(review);

  product.numReviews =
    product.reviews.length;

  product.rating =
    product.reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    ) / product.reviews.length;

  await product.save();

  res.status(201).json({
    status: 'success',
    message: 'Review successfully added'
  });
});


// ==========================================
// UPLOAD PRODUCT IMAGE
// POST /api/products/upload-image
// Access: Private
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
  getStoreProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  uploadProductImage
};