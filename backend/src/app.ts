import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.json({
      status: "ok",
      service: "backend",
      message: "GitHub Developer Search API",
      endpoints: ["/health", "/api/health", "/api/github/:username"],
    });
  });

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
