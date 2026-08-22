const express = require('express');
const router = express.Router();

const {
  createProduct,
  uploadProductImage
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', protect, createProduct);

router.post(
  '/upload-image',
  protect,
  upload.single('image'),
  uploadProductImage
);

module.exports = router;