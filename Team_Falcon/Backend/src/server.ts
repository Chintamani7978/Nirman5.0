import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import userRoutes from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.send("OK"));

// Routes
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
