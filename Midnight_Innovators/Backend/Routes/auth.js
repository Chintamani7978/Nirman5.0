const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { registerFarmer } = require('../controllers/farmerController');

router.post('/register', upload.fields([
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'ror', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), registerFarmer);

module.exports = router;