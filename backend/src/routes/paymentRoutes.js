const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    createCheckoutSession
} = require("../controllers/paymentController");

router.post(
    "/create-checkout-session",
    auth,
    createCheckoutSession
);

module.exports = router;