import compression from "compression";
import express from "express";
import morgan from "morgan";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "8080", 10);

async function loadGitHubTokenFromSSM() {
  if (process.env.GITHUB_TOKEN) {
    return;
  }

  // 開発時のみ使うため、本番のデプロイ物に含めないよう動的に読み込む
  const { GetParameterCommand, SSMClient } = await import(
    "@aws-sdk/client-ssm"
  );
  const name = `/kanaru.me-v2/${process.env.ENVIRONMENT_NAME}/github-token`;

  try {
    const response = await new SSMClient().send(
      new GetParameterCommand({ Name: name, WithDecryption: true }),
    );
    process.env.GITHUB_TOKEN = response.Parameter?.Value;
    console.log(`Loaded GITHUB_TOKEN from SSM Parameter Store: ${name}`);
  } catch (error) {
    console.error(`Failed to get SSM parameter "${name}":`, error);
  }
}

const app = express();

app.use(compression());
app.disable("x-powered-by");

if (DEVELOPMENT) {
  console.log("Starting development server");
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );
  // .env は Vite の起動時に読み込まれるため、その後に取得する
  await loadGitHubTokenFromSSM();
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log("Starting production server");
  app.use(morgan("tiny"));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
