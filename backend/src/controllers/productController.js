const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Store = require('../models/Store');

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
        inventoryCount,
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
    const products = await Product.find({ 
        storeId: req.params.storeId, 
        isPublished: true 
    }).populate('categoryId', 'name slug'); // Include category details

    res.json(products);
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

module.exports = {
    createCategory,
    getStoreCategories,
    deleteCategory,
    updateCategory,
    createProduct,
    getStoreProducts,
    deleteProduct,
    updateProduct
};