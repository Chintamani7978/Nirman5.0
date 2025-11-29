require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const farmerRoutes = require('./routes/farmerRoutes');
app.use('/api/farmer', farmerRoutes);

app.use('/auth', require('./routes/auth'));

// Serve static files
app.use(express.static('public')); // to serve login.html or other public files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // for uploaded files

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api/products', require('./routes/productRoutes'));
app.use('/uploads/products', express.static('uploads/products'));

// NEW ROUTES - Add these
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/revenue', require('./routes/revenueRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// Farmer Aadhaar login endpoint - Add this
app.get('/api/farmers/login/:aadhaar', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const farmerProduct = await Product.findOne({ aadhaar: req.params.aadhaar });
    
    if (farmerProduct) {
      // Farmer exists
      res.json({
        aadhaar: farmerProduct.aadhaar,
        name: farmerProduct.farmerName,
        mobile: farmerProduct.contactNumber,
        exists: true
      });
    } else {
      // New farmer
      res.json({
        aadhaar: req.params.aadhaar,
        name: `Farmer ${req.params.aadhaar}`,
        mobile: 'Not provided',
        exists: false
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});