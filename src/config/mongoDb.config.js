import mongoose from "mongoose";
import env from "./env.config.js";
import { logger } from "../utils/logger.js";

export const connectMongoDB = async () => {
  try {
    // Conexión con la bd
    mongoose.connect(env.MONGO_URL);
    logger.log("info", "Mongo DB Conectado");
  } catch (error) {
    console.log(error);
  }
};
