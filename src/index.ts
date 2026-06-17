import express from "express";
import { router, pool } from "@/routes/users.js";
import { config } from "@/config/index.js";
import prisma from "./db.js";

const server = express();

server.use(express.json());
server.use(router);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const shutdown = () => {
  server.close(() => {
    pool.terminate();
    prisma.$disconnect();

    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (error: Error) => {
  console.error(`Error is ${error}`);
  shutdown();
});

process.on("unhandledRejection", (error: unknown) => {
  console.error(`Error is ${error}`);
  shutdown();
});

export default server;
