import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";



export const dbconnectionwithmongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Error while connecting to database", error);
  }
}