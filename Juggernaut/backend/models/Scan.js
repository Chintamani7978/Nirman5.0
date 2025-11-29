const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  // Link to the user who scanned it (Optional for now)
  userId: { type: String, default: 'anonymous' },
  
  // 'disease' or 'pest'
  type: { type: String, required: true, enum: ['disease', 'pest'] },
  
  // The Image (Base64 string or URL)
  image: { type: String, required: true },

  // The AI Analysis Result
  diagnosis: {
    diseaseName: { type: String, required: true },
    pathogen: { type: String },
    confidence: { type: Number, required: true }, // e.g., 0.98
    severity: { type: String, enum: ['healthy', 'low', 'medium', 'high'] },
    description: { type: String },
    treatments: [{ type: String }] // Array of strings
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', ScanSchema);