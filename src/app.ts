import { Hono } from "hono";
import { requestId, type RequestIdVariables } from "hono/request-id";
import { auth } from "./lib/auth.js";
import { pino } from "pino";
import type { IncomingMessage, ServerResponse } from "node:http";
import { loggerMiddleware } from "./lib/logger.js";
import { cors } from "hono/cors";

type Bindings = {
  incoming: IncomingMessage;
  outgoing: ServerResponse;
};

type Variables = RequestIdVariables & {
  logger: pino.BaseLogger;
};

export const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(requestId());
app.use(loggerMiddleware);
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "http://localhost:3001", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/openapi", async (c) => {
  const schema = await auth.api.generateOpenAPISchema();
  return c.json(schema);
});

app.get("/healthcheck", (c) => {
  return c.text("Ok!");
});
