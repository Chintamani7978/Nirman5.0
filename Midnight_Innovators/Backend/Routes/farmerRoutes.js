const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { 
  registerFarmer, 
  loginFarmer,
  forgotPasswordInit,
  resetPassword
} = require("../controllers/farmerController");

// Register route with file uploads
router.post("/register", upload.fields([
  { name: "aadhaarCard", maxCount: 1 },
  { name: "ror", maxCount: 1 },
  { name: "bankPassbook", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 }
]), registerFarmer);

// Login route
router.post("/login", loginFarmer);

// Password recovery routes
router.post("/forgot-password", forgotPasswordInit);
router.post("/reset-password", resetPassword);

module.exports = router;