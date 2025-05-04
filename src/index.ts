import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { requestId, type RequestIdVariables } from "hono/request-id";
import { auth } from "./lib/auth.js";
import { pino } from "pino";
import type { IncomingMessage, ServerResponse } from "node:http";
import { logger } from "./lib/logger.js";
import { cors } from "hono/cors";

type Bindings = {
  incoming: IncomingMessage;
  outgoing: ServerResponse;
};

type Variables = RequestIdVariables & {
  logger: pino.BaseLogger;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(requestId());
app.use(logger);
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

app.get("/healthcheck", (c) => {
  return c.text("Ok!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
