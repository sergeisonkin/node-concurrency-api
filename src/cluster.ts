import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Forking a new worker...");

    if (signal !== "SIGTERM" && code !== 0) {
      cluster.fork();
    }
  });
} else {
  import("./index.js");

  console.log(`Worker ${process.pid} started`);
}
