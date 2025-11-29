import express from "express";
import {
  createAlias,
  getAliases,
  deleteAlias,
  getAliasStats,
} from "../controllers/aliasController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createAlias);
router.get("/", authMiddleware, getAliases);
router.get("/stats", authMiddleware, getAliasStats);
router.delete("/:id", authMiddleware, deleteAlias);

export default router;


