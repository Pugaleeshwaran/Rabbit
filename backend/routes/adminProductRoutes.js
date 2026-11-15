const express = require("express");
const Products = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @router GET /api/admin/products
// @desc Get all product (Admin only)
// @access Private/Adimn

router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Products.find({});
        res.json(products);
        // console.log(products);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })

    }
});

module.exports = router