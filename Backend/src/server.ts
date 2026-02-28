import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
 
const app = express();

/* ================= BASIC SECURITY ================= */

// hide tech stack
app.disable("x-powered-by");

// secure headers
app.use(helmet());

// secure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// body parser (limit protects from DOS)
app.use(express.json({ limit: "10kb" }));

// protect against NoSQL injection
app.use(mongoSanitize());

// prevent query pollution
app.use(hpp());

// rate limiter (important for public apps)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* ================= DATABASE ================= */

const mongoURL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!mongoURL) {
  throw new Error("MONGO_URI missing in .env");
}

mongoose
  .connect(mongoURL)
  .then(() => console.log("🌐 MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });

/* ================= ROUTES ================= */

app.get("/", (_req: Request, res: Response) => {
  res.send("SoulSync Mental Health API Running 💙");
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Server Error:", err.message);

  res.status(err.status || 500).json({
    msg: "Internal server error",
  });
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});