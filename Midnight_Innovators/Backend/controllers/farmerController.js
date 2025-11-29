const Farmer = require('../models/Farmer');
const fs = require('fs');
const path = require('path');

// Farmer Registration
exports.registerFarmer = async (req, res) => {
  try {
    const requiredFields = [
      'name', 'dob', 'aadhaar', 'password', 'presentAddress',
      'permanentAddress', 'state', 'district', 'pincode', 'mobile', 'email'
    ];

    // Validate required fields
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          success: false,
          error: `${field} is required`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Clean and validate Aadhaar
    const aadhaar = req.body.aadhaar.replace(/\D/g, '');
    if (aadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        error: 'Aadhaar must be 12 digits',
        timestamp: new Date().toISOString()
      });
    }

    // Validate mobile
    const mobile = req.body.mobile.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number (10 digits starting with 6-9)',
        timestamp: new Date().toISOString()
      });
    }

    // Validate email
    const email = req.body.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        timestamp: new Date().toISOString()
      });
    }

    // Check document uploads
    if (!req.files || 
        !req.files['aadhaarCard'] || 
        !req.files['ror'] || 
        !req.files['bankPassbook'] || 
        !req.files['profilePhoto']) {
      return res.status(400).json({
        success: false,
        error: 'All documents are required',
        timestamp: new Date().toISOString()
      });
    }

    // Create new farmer
    const farmer = new Farmer({
      ...req.body,
      aadhaar: aadhaar,
      mobile,
      email,
      password: req.body.password, // Note: In production, hash this password
      documents: {
        aadhaarCard: req.files['aadhaarCard'][0].filename,
        ror: req.files['ror'][0].filename,
        bankPassbook: req.files['bankPassbook'][0].filename,
        profilePhoto: req.files['profilePhoto'][0].filename
      }
    });

    await farmer.save();

    res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      farmerId: farmer._id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          fs.unlink(path.join(__dirname, '../uploads', file.filename), () => {});
        });
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `${duplicateField} already registered`,
        timestamp: new Date().toISOString()
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during registration',
      timestamp: new Date().toISOString()
    });
  }
};

// Farmer Login
exports.loginFarmer = async (req, res) => {
  try {
    const { aadhaar, password } = req.body;
    
    if (!aadhaar || !password) {
      return res.status(400).json({
        success: false,
        error: 'Aadhaar and password are required',
        timestamp: new Date().toISOString()
      });
    }

    const cleanedAadhaar = aadhaar.replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        error: 'Aadhaar must be 12 digits',
        timestamp: new Date().toISOString()
      });
    }

    const farmer = await Farmer.findOne({ aadhaar: cleanedAadhaar });
    if (!farmer) {
      return res.status(401).json({
        success: false,
        error: 'No farmer found with this Aadhaar',
        timestamp: new Date().toISOString()
      });
    }

    // Plain text password comparison (not recommended for production)
    if (password !== farmer.password) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password',
        timestamp: new Date().toISOString()
      });
    }

    const farmerData = farmer.toObject();
    delete farmerData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      farmer: farmerData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login',
      timestamp: new Date().toISOString()
    });
  }
};

// Forgot Password - Step 1: Verify Aadhaar
exports.forgotPasswordInit = async (req, res) => {
  try {
    const { aadhaar } = req.body;
    
    if (!aadhaar) {
      return res.status(400).json({ 
        success: false,
        error: 'Aadhaar number is required',
        timestamp: new Date().toISOString()
      });
    }

    const cleanedAadhaar = aadhaar.replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        error: 'Aadhaar must be 12 digits',
        timestamp: new Date().toISOString()
      });
    }

    const farmer = await Farmer.findOne({ aadhaar: cleanedAadhaar });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'No farmer found with this Aadhaar',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account found',
      farmer: {
        name: farmer.name,
        mobile: farmer.mobile,
        email: farmer.email,
        district: farmer.district
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password recovery',
      timestamp: new Date().toISOString()
    });
  }
};

// Forgot Password - Step 2: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { aadhaar, newPassword } = req.body;
    
    if (!aadhaar || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Aadhaar and new password are required',
        timestamp: new Date().toISOString()
      });
    }

    const cleanedAadhaar = aadhaar.replace(/\D/g, '');
    if (cleanedAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Aadhaar number',
        timestamp: new Date().toISOString()
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
        timestamp: new Date().toISOString()
      });
    }

    const farmer = await Farmer.findOneAndUpdate(
      { aadhaar: cleanedAadhaar },
      { password: newPassword },
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Farmer not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset',
      timestamp: new Date().toISOString()
    });
  }
};