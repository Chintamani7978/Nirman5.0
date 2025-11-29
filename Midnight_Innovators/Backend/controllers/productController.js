const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const cloudinary = require('cloudinary').v2;

// Upload Product
exports.uploadProduct = async (req, res) => {
  try {
    const { name, price, quantity, unit, aadhaar, description, location, contactNumber, category } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Get the complete Cloudinary URL from req.file
    const image = req.file.path;

    // Validate required fields
    if (!name || !price || !quantity || !unit || !aadhaar || !description || !location || !contactNumber || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const farmer = await Farmer.findOne({ aadhaar });

    if (!farmer) {
      return res.status(400).json({ message: 'Error verifying Aadhaar' });
    }

    const newProduct = new Product({
      aadhaar,
      farmerName: farmer.name,
      contactNumber,
      name,
      description,
      price,
      quantity,
      unit,
      category,
      location,
      image // This should now be the complete Cloudinary URL
    });

    await newProduct.save();
    res.status(200).json({ message: 'Product uploaded successfully', product: newProduct });
  } catch (err) {
    console.error('Error uploading product:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Products with fixed image URLs
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Fix incomplete Cloudinary URLs if needed
    const productsWithFixedUrls = products.map(product => {
      if (product.image && !product.image.includes('http')) {
        // This is a fallback for incomplete URLs - adjust based on your Cloudinary account
        product.image = `https://res.cloudinary.com/drnedkcn3/image/upload/v1757848245/products/${product.image}`;
      }
      return product;
    });
    
    res.status(200).json(productsWithFixedUrls);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get Products by Category with fixed URLs
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    
    // Fix incomplete Cloudinary URLs if needed
    const productsWithFixedUrls = products.map(product => {
      if (product.image && !product.image.includes('http')) {
        product.image = `https://res.cloudinary.com/drnedkcn3/image/upload/v1757848245/products/${product.image}`;
      }
      return product;
    });
    
    res.status(200).json(productsWithFixedUrls);
  } catch (err) {
    console.error('Error fetching products by category:', err.message);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get Products by Farmer with fixed URLs
exports.getProductsByFarmer = async (req, res) => {
  try {
    const { aadhaar } = req.params;
    const products = await Product.find({ aadhaar });
    
    // Fix incomplete Cloudinary URLs if needed
    const productsWithFixedUrls = products.map(product => {
      if (product.image && !product.image.includes('http')) {
        product.image = `https://res.cloudinary.com/drnedkcn3/image/upload/v1757848245/products/${product.image}`;
      }
      return product;
    });
    
    res.status(200).json(productsWithFixedUrls);
  } catch (err) {
    console.error('Error fetching farmer products:', err.message);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Update Product - Handle image update if needed
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, unit, description, category } = req.body;
    
    const updateData = { name, price, quantity, unit, description, category };
    
    // If a new image was uploaded, add it to the update data
    if (req.file) {
      updateData.image = req.file.path; // Complete Cloudinary URL
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

// Delete Product - Also delete from Cloudinary if needed
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Optional: Delete image from Cloudinary
    if (product.image && product.image.includes('cloudinary.com')) {
      try {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError.message);
        // Continue with product deletion even if Cloudinary deletion fails
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

// Search Products with fixed URLs
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    
    // Fix incomplete Cloudinary URLs if needed
    const productsWithFixedUrls = products.map(product => {
      if (product.image && !product.image.includes('http')) {
        product.image = `https://res.cloudinary.com/drnedkcn3/image/upload/v1757848245/products/${product.image}`;
      }
      return product;
    });
    
    res.status(200).json(productsWithFixedUrls);
  } catch (err) {
    console.error('Error searching products:', err.message);
    res.status(500).json({ message: 'Error searching products', error: err.message });
  }
};

// One-time function to fix existing incomplete URLs
exports.fixIncompleteUrls = async (req, res) => {
  try {
    const products = await Product.find();
    let fixedCount = 0;
    
    for (let product of products) {
      if (product.image && !product.image.includes('http')) {
        product.image = `https://res.cloudinary.com/drnedkcn3/image/upload/v1757848245/products/${product.image}`;
        await product.save();
        fixedCount++;
      }
    }
    
    res.status(200).json({ 
      message: `Fixed ${fixedCount} product image URLs` 
    });
  } catch (err) {
    console.error('Error fixing URLs:', err.message);
    res.status(500).json({ message: 'Error fixing URLs', error: err.message });
  }
};