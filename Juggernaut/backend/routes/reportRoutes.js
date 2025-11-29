const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// 1. GET ALL REPORTS
router.get('/', async (req, res) => {
  try {
    // .lean() converts complex Mongoose documents to simple JavaScript objects
    const reports = await Report.find().sort({ createdAt: -1 }).limit(50).lean();
    
    // Transform _id to id to prevent frontend confusion
    const formattedReports = reports.map(report => ({
      ...report,
      id: report._id.toString(), // Ensure 'id' exists for React keys
    }));

    res.json(formattedReports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE A NEW REPORT
router.post('/', async (req, res) => {
  const { type, title, description, reporter, severity, image } = req.body;

  const report = new Report({
    type,
    title,
    description,
    reporter: reporter || 'Anonymous',
    severity: severity || 'medium',
    image: image, // Note: In production, this should be a Cloudinary URL, not base64
    location: { lat: 0, lng: 0 }
  });

  try {
    const newReport = await report.save();

    // --- CRITICAL: BROADCAST TO SOCKET ---
    const io = req.app.get('io'); // Get the socket instance
    if (io) {
      io.emit('receive_report', newReport); // Send to EVERYONE including sender
    }

    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. REACT TO REPORT (Confirm/Flag)
router.put('/:id/react', async (req, res) => {
    const { action } = req.body; // 'confirm' or 'flag'
    
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });

        if (action === 'confirm') {
            report.confirmations += 1;
        } else if (action === 'flag') {
            // report.flags += 1; // Assuming you add a flags field to schema later
        }
        
        const updatedReport = await report.save();

        // Broadcast update
        const io = req.app.get('io');
        if (io) {
            io.emit('receive_reaction', updatedReport);
        }

        res.json(updatedReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;