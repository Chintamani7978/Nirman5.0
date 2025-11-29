const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. GET /api/products/:qrCode
// Verify a product by its QR Code ID
router.get('/:qrCode', async (req, res) => {
  try {
    const qrCode = req.params.qrCode;
    
    // Find product in DB
    const product = await Product.findOne({ qrCodeId: qrCode });

    if (!product) {
      return res.status(404).json({ message: "Product not found or counterfeit." });
    }

    // Increment scan count
    product.scanCount += 1;
    await product.save();

    res.json(product);

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Server Error during verification." });
  }
});

// 2. POST /api/products
// Register a new product
router.post('/', async (req, res) => {
  try {
    const { qrCodeId, productName, manufacturer, batchNumber, expiryDate, manufacturedDate, certifications, isAuthentic } = req.body;

    // Check for duplicates
    const existingProduct = await Product.findOne({ qrCodeId });
    if (existingProduct) {
      return res.status(400).json({ message: "This QR Code ID is already registered." });
    }

    const newProduct = new Product({
      qrCodeId,
      productName,
      manufacturer,
      batchNumber,
      manufacturedDate,
      expiryDate,
      isAuthentic: isAuthentic !== undefined ? isAuthentic : true,
      certifications: certifications || [],
      scanCount: 0
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;