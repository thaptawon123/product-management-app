import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let sequelize = null;
let isDbConnected = false;

const hasDbConfig =
  Boolean(process.env.DB_NAME && process.env.DB_USER) ||
  Boolean(process.env.DATABASE_URL);

if (hasDbConfig) {
  try {
    const useSsl =
      process.env.DB_SSL === "true" ||
      (process.env.DATABASE_URL &&
        !process.env.DATABASE_URL.includes("localhost") &&
        !process.env.DATABASE_URL.includes("127.0.0.1"));

    const dialectOptions = useSsl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {};

    if (process.env.DATABASE_URL) {
      sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        logging: false,
        dialectOptions,
      });
    } else {
      sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST || "localhost",
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
          dialect: "postgres",
          logging: false,
          dialectOptions,
        },
      );
    }
  } catch (err) {
    console.warn("[AI Studio] Failed to initialize Sequelize client:", err.message);
  }
}

const connectDB = async () => {
  if (!sequelize) {
    console.warn(
      "[AI Studio] PostgreSQL credentials not configured. In-memory data store active.",
    );
    return false;
  }
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!");
    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
    });
    console.log("Table Synchronized!");
    isDbConnected = true;
    return true;
  } catch (error) {
    console.warn(
      "[AI Studio] PostgreSQL connection failed. In-memory fallback active:",
      error.message,
    );
    isDbConnected = false;
    return false;
  }
};

export { sequelize, connectDB, isDbConnected };
