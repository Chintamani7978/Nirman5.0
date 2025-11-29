const express = require('express');
const router = express.Router();
const Scan = require('../models/Scan');

// --- SERVER-SIDE DISEASE DATABASE ---
// This replaces the mock data in your React code.
const DISEASE_DB = [
  {
    diseaseName: 'Early Blight',
    pathogen: 'Alternaria solani',
    confidence: 0.94,
    severity: 'high',
    description: 'Fungal infection causing concentric rings on leaves. Rapid spread possible in humid conditions.',
    treatments: [
      'Apply copper-based fungicide immediately',
      'Prune infected leaves to increase airflow',
      'Rotate crops next season'
    ]
  },
  {
    diseaseName: 'Yellow Leaf Rust',
    pathogen: 'Puccinia striiformis',
    confidence: 0.88,
    severity: 'medium',
    description: 'Yellow stripes appearing on leaves. Can reduce yield if not treated.',
    treatments: [
      'Apply sulfur-based fungicides',
      'Reduce nitrogen fertilizer temporarily',
      'Monitor surrounding plants'
    ]
  },
  {
    diseaseName: 'Healthy Plant',
    pathogen: 'N/A',
    confidence: 0.99,
    severity: 'healthy',
    description: 'No significant signs of disease or pest damage detected.',
    treatments: [
      'Continue regular monitoring',
      'Maintain current irrigation schedule',
      'Ensure balanced fertilization'
    ]
  }
];

// 1. POST /api/scans/diagnose
// Receives an image, runs "analysis", saves to DB, returns result.
router.post('/diagnose', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // --- AI SIMULATION LOGIC START ---
    // In the future, you will send 'image' to your Python API here.
    // For now, we simulate a 2-second delay and pick a random result.
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomResult = DISEASE_DB[Math.floor(Math.random() * DISEASE_DB.length)];
    // --- AI SIMULATION LOGIC END ---

    // Create new Scan record
    const newScan = new Scan({
      type: 'disease',
      image: image, // Store the Base64 string
      diagnosis: randomResult
    });

    // Save to MongoDB
    await newScan.save();

    // Return the result to the frontend
    res.status(200).json(newScan);

  } catch (err) {
    console.error("Diagnosis Error:", err);
    res.status(500).json({ message: "Server Error processing image" });
  }
});

// 2. GET /api/scans/history
// (Optional) If you want to show past scans
router.get('/history', async (req, res) => {
  try {
    const history = await Scan.find({ type: 'disease' }).sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;