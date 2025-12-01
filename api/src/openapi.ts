import { writeFileSync } from "node:fs";
import { app } from "./app";

const spec = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: {
    title: "Kanaru.me API",
    version: "1.0.0",
    description: "Kanaru.me のバックエンドAPIドキュメント",
  },
});

writeFileSync("openapi.json", JSON.stringify(spec, null, 2));
console.log("OpenAPI 3.1 specification generated at openapi.json");
