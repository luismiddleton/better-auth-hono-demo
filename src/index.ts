import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { requestId, type RequestIdVariables } from "hono/request-id";
import { auth } from "./lib/auth.js";
import { pinoHttp } from "pino-http";
import { pino } from "pino";
import type { IncomingMessage, ServerResponse } from "node:http";
import { logger, loggerBase } from "./lib/logger.js";

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
