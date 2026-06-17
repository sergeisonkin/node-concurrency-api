import pino from "pino";
import { threadId } from "worker_threads";
const logger = pino();

export default logger.child({ pid: process.pid, threadId });