// worker/index.ts
// NOTE: Routes belong in ./user-routes.ts. This file wires the app together.

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Env } from "./core-utils";
export * from "./core-utils";

import { userRoutes } from "./user-routes";

export type ClientErrorReport = {
  message: string;
  url: string;
  timestamp: string;
} & Record<string, unknown>;

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/api/health", (c) =>
  c.json({
    success: true,
    data: { status: "healthy", timestamp: new Date().toISOString() },
  }),
);

app.post("/api/client-errors", async (c) => {
  try {
    const e = await c.req.json<ClientErrorReport>();
    console.error(
      "[CLIENT ERROR]",
      JSON.stringify(
        {
          timestamp: e.timestamp || new Date().toISOString(),
          message: e.message,
          url: e.url,
          stack: (e as any).stack,
          componentStack: (e as any).componentStack,
          errorBoundary: (e as any).errorBoundary,
        },
        null,
        2,
      ),
    );
    return c.json({ success: true });
  } catch (error) {
    console.error("[CLIENT ERROR HANDLER] Failed:", error);
    return c.json({ success: false, error: "Failed to process" }, 500);
  }
});

// Wire user routes once, deterministically (no runtime dynamic import).
userRoutes(app);

app.notFound((c) => c.json({ success: false, error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error(`[ERROR] ${err instanceof Error ? err.stack || err.message : String(err)}`);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
