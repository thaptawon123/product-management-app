import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import productRouter from "./router/productRouter.js";

dotenv.config();

// Support PORT assigned by Render, BACKEND_PORT from env, or default to 5000
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;
const app = express();

// Configure CORS to allow requests from Vercel deployments, localhost, and other clients
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<h1>Welcome to Restful API for Product Management App</h1>");
});

app.use("/api/products", productRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on: http://0.0.0.0:${PORT}`);
});
