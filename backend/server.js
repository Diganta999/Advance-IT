import express from "express";
import mongoose from "mongoose";
// Server restart triggered by settings update
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import User from "./models/User.js";
import Settings from "./models/Settings.js";

// Fix for Windows Node.js failing to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
console.log("--- Environment Check ---");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ LOADED" : "❌ NOT LOADED");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ LOADED" : "❌ NOT LOADED");
console.log("------------------------");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Maintenance Mode Middleware
app.use(async (req, res, next) => {
  if (
    req.path.startsWith("/api/settings") ||
    req.path.startsWith("/api/auth/login") ||
    (req.path === "/api/messages" && req.method === "POST")
  ) {
    return next();
  }

  try {
    const settings = await Settings.findOne();
    if (settings?.maintenanceMode && !req.path.startsWith("/api/auth")) {
      if (!req.headers.authorization) {
        return res.status(503).json({
          maintenance: true,
          message: "Site is currently under maintenance. Please try again later.",
        });
      }
    }
    next();
  } catch (error) {
    next();
  }
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/content", contentRoutes);

// Seed default admin if not exists
mongoose.connection.once("open", async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@advanceit.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@advanceit.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Default Admin created: admin@advanceit.com / admin123");
    }
  } catch (err) {
    console.error("Failed to seed admin:", err);
  }
});

app.get("/api/status", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
