import serverless_handler from "serverless-http";
import app from "./server.js";

export const handler = serverless_handler(app);
