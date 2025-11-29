import express from "express";
import { receiveOTP, getOTP } from "../controllers/otpController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/receive", receiveOTP);
router.get("/:aliasId", authMiddleware, getOTP);

export default router;


