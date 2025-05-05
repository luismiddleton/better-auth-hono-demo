import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { logger } from "./lib/logger.js";

// Log the worker process
logger.info(`Worker process ${process.pid} is running`);

// Serve the app
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  }
);
