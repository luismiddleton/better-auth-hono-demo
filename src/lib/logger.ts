import { createMiddleware } from "hono/factory";
import { pino as createLogger } from "pino";

export const logger = createLogger({
  transport: {
    target: "pino-pretty",
  },
});

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const requestId = c.get("requestId");
  const childLogger = logger.child({ requestId }); // Hono automatically generates a request ID

  // Attach the logger to the Hono context
  c.set("logger", childLogger);

  const startTime = Date.now();

  try {
    await next();
  } finally {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log the request and response details
    childLogger.info(
      {
        req: {
          method: c.req.method,
          url: c.req.url,
          id: requestId,
        },
        res: {
          status: c.res.status,
          responseTime: `${responseTime}ms`,
        },
      },
      `${c.req.method} ${c.req.url} - ${c.res.status}`
    );
  }
});
