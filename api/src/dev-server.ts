import { serve } from "@hono/node-server";
import { app, setSecretRepository } from "./app";
import { EnvironmentVariableSecretRepository } from "./infrastructure/repositories/EnvironmentVariableSecretRepository";

// 開発環境用のSecretRepositoryを作成
const secretRepository = new EnvironmentVariableSecretRepository();
setSecretRepository(secretRepository);

serve(
  {
    fetch: app.fetch,
    port: 3010,
  },
  (info) => {
    console.log(`Dev server running at http://localhost:${info.port}`);
  },
);
