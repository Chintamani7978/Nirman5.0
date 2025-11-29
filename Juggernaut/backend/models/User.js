const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    sparse: true, // Allows multiple users to have 'null' email if they used phone
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    unique: true, 
    sparse: true // Allows multiple users to have 'null' phone if they used email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['farmer', 'expert', 'admin'],
    default: 'farmer'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);