import { parentPort } from "worker_threads";

parentPort?.on("message", (user) => {
  // "heavy" work pretender!!!
  let result = 0;

  for (let i = 0; i < user.id * 2_000_000_000; i++) {
    result += i;
  }

  parentPort?.postMessage({
    userId: user.id,
    result,
  });
});
