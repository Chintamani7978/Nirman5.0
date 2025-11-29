const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');

// Initialize Client
// IMPORTANT: You must set GOOGLE_APPLICATION_CREDENTIALS in your .env or environment variables
// pointing to your JSON key file path.
const client = new vision.ImageAnnotatorClient();

// POST /api/vision/read-label
router.post('/read-label', async (req, res) => {
  try {
    const { image } = req.body; // Expecting Base64 string

    if (!image) return res.status(400).json({ message: "No image provided" });

    // Strip metadata header if present (e.g., "data:image/jpeg;base64,")
    const base64Image = image.split(';base64,').pop();
    const request = {
      image: { content: base64Image },
      features: [{ type: 'TEXT_DETECTION' }] // We want to read text
    };

    const [result] = await client.annotateImage(request);
    const fullText = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';

    // Simple parsing logic (You can make this smarter!)
    const extractedData = {
      rawText: fullText,
      batchNumber: fullText.match(/Batch\s*[:#]?\s*([A-Z0-9-]+)/i)?.[1] || '',
      expiryDate: fullText.match(/Exp\w*\s*[:.]?\s*(\d{2,4}[-/]\d{2}[-/]\d{2,4})/i)?.[1] || '',
      manufacturer: fullText.match(/Mfg\w*\s*[:.]?\s*([A-Za-z\s]+)/i)?.[1] || ''
    };

    res.json(extractedData);

  } catch (err) {
    console.error("Vision API Error:", err);
    res.status(500).json({ message: "Failed to analyze image with Google Cloud Vision." });
  }
});

module.exports = router;