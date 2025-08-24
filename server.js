import express from "express";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import { dbconnectionwithmongoose } from "./config/db.js";
import cookieParser from "cookie-parser";


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

app.use("/api/auth", authRoutes);
app.use("/api/membership", membershipRoutes);

 
dbconnectionwithmongoose()

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
