import express from "express";
import dotenv from "dotenv";
import logger from "./config/logger.js";


dotenv.config();

const app = express();

// Example route
app.get("/", (req, res) => {
  res.send("Hello World from Express on Render!");
});

// Render will provide the port via env variable
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
