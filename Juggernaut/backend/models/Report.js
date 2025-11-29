const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pest', 'disease', 'weather', 'healthy'], required: true },
  description: { type: String },
  reporter: { type: String, default: 'Anonymous' },
  severity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  image: { type: String }, // We will store the image URL here (e.g., from Cloudinary)
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  confirmations: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);