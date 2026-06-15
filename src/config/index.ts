import "dotenv/config";

export const config = {
  databaseUrl: process.env.DATABASE_URL || "",
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  workerCount: Number(process.env.WORKERS_COUNT) || 4,
  threadPoolSize: Number(process.env.THREAD_POOL_SIZE) || 4,
};
