import { Router } from "express";
import { threadId } from "worker_threads";

const healthRouter = Router();

healthRouter.get("/health", (req, res) => {
  res.status(200).send({
    pid: process.pid,
    threadId: threadId,
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
  });
});


export default healthRouter;