const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // The unique ID inside the QR code string
  qrCodeId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  productName: { type: String, required: true },     // e.g., "GreenLife Organic Seeds"
  manufacturer: { type: String, required: true },    // e.g., "GreenLife Pvt Ltd"
  batchNumber: { type: String },
  
  // Dates for validity
  manufacturedDate: { type: Date },
  expiryDate: { type: Date },

  // Is this a genuine product? (If false, show Red Alert)
  isAuthentic: { type: Boolean, default: true },

  // Certifications (e.g., "ISO-9001", "Organic")
  certifications: [{ type: String }],

  // Track usage stats
  scanCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);