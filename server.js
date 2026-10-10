import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./backend/config/database.js";
import productRouter from "./backend/router/productRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Initialize database with resilient in-memory fallback
connectDB().catch((err) => {
  console.warn("[AI Studio] Database initialization warning:", err.message);
});

// Backend REST API endpoints
app.use("/api/products", productRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Frontend handler
const distPath = path.resolve(__dirname, "frontend/dist");
const isProduction =
  process.env.NODE_ENV === "production" && fs.existsSync(distPath);

if (!isProduction) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root: path.resolve(__dirname, "frontend"),
    server: {
      middlewareMode: true,
      host: "0.0.0.0",
    },
    appType: "spa",
  });

  app.use(vite.middlewares);

  // Fallback for HTML navigation requests (Express 5 compatible)
  app.use(async (req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    try {
      const templatePath = path.resolve(__dirname, "frontend/index.html");
      let template = fs.readFileSync(templatePath, "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(distPath));
  // SPA fallback for Express 5
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[AI Studio] Server error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[AI Studio] Server listening on http://0.0.0.0:${PORT}`);
});
