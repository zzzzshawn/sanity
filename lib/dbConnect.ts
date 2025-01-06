import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env";

dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables");
  }

  try {
    const db = await mongoose.connect(env.DATABASE_URL);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected successfully");
  } catch (error) {
    console.error("Database connection failed: ", error);
    throw error;
  }
}

export default dbConnect;
