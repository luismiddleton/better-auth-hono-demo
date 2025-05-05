import cluster from "node:cluster";
import os from "node:os";
import { logger } from "./lib/logger.js";

if (cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);

  // Get number of CPUs
  const numOfCpus = os.cpus().length;

  // Fork workers.
  for (let i = 0; i < numOfCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.info(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
  });
} else {
  import("./worker.js");
}
