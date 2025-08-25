import express from "express";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import { dbconnectionwithmongoose } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";



dotenv.config();

const app = express();

// Example route
app.get("/", (req, res) => {
  res.send("Hello World from Express on Render!");
});

// Render will provide the port via env variable
const PORT = process.env.PORT || 8000;


import authRoutes from "./routes/auth.routes.js";
import membershipRoutes from "./routes/membershipRoutes.js";

app.use(express.json());
app.use(cookieParser());

// CORS configuration
const ALLOWED_ORIGINS = [
  // "http://localhost:3000",        // Next.js dev
  "https://home-workout-fitness.onrender.com"     // prod domain

];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and credentials
}));

app.use("/api/auth", authRoutes);
app.use("/api/membership", membershipRoutes);


dbconnectionwithmongoose()

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
