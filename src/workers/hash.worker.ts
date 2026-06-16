import bcrypt from "bcryptjs";
import { parentPort } from "worker_threads";

const SALT_ROUNDS = 12;

parentPort?.on("message", async (pass) => {
  const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

  parentPort?.postMessage(hashedPassword);
});
