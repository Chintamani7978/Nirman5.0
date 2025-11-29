import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const bootstrap = async () => {
  // 2. Connect DB
  const { default: connectDB } = await import("./config/db.js");
  await connectDB();

  // 3. Create express app
  const app = express();

  // 4. Middlewares
  app.use(express.json());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    })
  );
  const { default: rateLimiter } = await import("./middlewares/rateLimiter.js");
  app.use(rateLimiter);

  // Home route
  app.get("/", (req, res) => {
    res.json({
      status: "success",
      message: "MaskMe Backend is Live 🚀",
      docs: "/api"
    });
  });

  // Health route (before business routes)
  app.get("/api/health", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    const mongoState = states[mongoose.connection.readyState] || "unknown";

    res.json({
      status: "ok",
      uptime: process.uptime(),
      mongo: mongoState,
    });
  });

  // 5. Routes (auth -> alias -> otp -> others)
  const [
    { default: authRoutes },
    { default: aliasRoutes },
    { default: otpRoutes },
  ] = await Promise.all([
    import("./routes/authRoutes.js"),
    import("./routes/aliasRoutes.js"),
    import("./routes/otpRoutes.js"),
  ]);

  app.use("/api/auth", authRoutes);
  app.use("/api/alias", aliasRoutes);
  app.use("/api/otp", otpRoutes);

  // 6. Socket.io
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const { initNotifications } = await import("./sockets/notifications.js");
  initNotifications(io);

  // 7. Cron jobs
  await import("./cron/expiryCleanup.js");

  // 8. Start server
  const PORT = process.env.PORT || 10000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Server bootstrap failed:", error);
  process.exit(1);
});
