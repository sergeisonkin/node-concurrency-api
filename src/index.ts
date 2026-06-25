import express from "express";
import { router, pool } from "@/routes/users.js";
import { config } from "@/config/index.js";
import prisma from "./db.js";
import logger from "./utils/logger.js";
import healthRouter from "./routes/health.js";
import { isWindows } from "./utils/platform.js";

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
  });

  next();
});

server.use(router, healthRouter);

const httpServer = server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const shutdown = () => {
  httpServer.close(() => {
    pool.terminate();
    prisma.$disconnect();

    process.exit(0);
  });
};

if (isWindows) {
  process.on("SIGBREAK", shutdown);
  process.on("SIGINT", shutdown);
  process.on("message", (msg) => {
    if (msg === "shutdown") shutdown();
  });
} else {
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

process.on("uncaughtException", (error: Error) => {
  console.error(`Error is ${error}`);
  shutdown();
});

process.on("unhandledRejection", (error: unknown) => {
  console.error(`Error is ${error}`);
  shutdown();
});

export default server;
