import { serve } from "@hono/node-server";
import { app } from "./app";

serve(
  {
    fetch: app.fetch,
    port: 3010,
  },
  (info) => {
    console.log(`Dev server running at http://localhost:${info.port}`);
  },
);
