import serverless_handler from "serverless-http";
import handler from "./server.js";

const serverless = serverless_handler(handler);
export { serverless as handler };
