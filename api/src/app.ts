import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import type { Env as EnvConfig } from "./config/env";
import { validateEnv } from "./config/env";
import { DomainError } from "./domain/errors/DomainError";
import type { ISecretRepository } from "./domain/repositories/ISecretRepository";
import { setupContainer } from "./infrastructure/container/setup";
import { createArticleRouter } from "./interface/routes/articles";
import { createAuthRouter } from "./interface/routes/auth";
import { createOgRouter } from "./interface/routes/og";

// 再エクスポート（テストで使用）
export type { EnvConfig };

// モジュールレベル変数でSecretRepositoryを保持
let secretRepositoryInstance: ISecretRepository | null = null;

// モジュールレベル変数で環境変数をキャッシュ
let cachedEnv: EnvConfig | null = null;
let cachedContainer: ReturnType<typeof setupContainer> | null = null;

/**
 * SecretRepositoryを設定（エントリポイントから呼び出される）
 */
export function setSecretRepository(repository: ISecretRepository): void {
  secretRepositoryInstance = repository;
}

// 環境変数の型定義
export type Env = {
  Bindings: {
    DYNAMODB_TABLE_NAME: string;
    S3_BUCKET_NAME: string;
    S3_ORIGIN_URL: string;
    S3_KEY_PREFIX: string;
    AWS_REGION: string;
    ALLOWED_ORIGINS: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    INITIAL_BEARER_TOKEN: string;
  };
  Variables: {
    container: ReturnType<typeof setupContainer>;
    env: EnvConfig;
  } & JwtVariables;
};

// Lambda/開発環境用のアプリケーション
// 環境変数はミドルウェアで動的に取得するため、createApp関数は削除し直接アプリを構築
const app = new OpenAPIHono<Env>();

// 環境変数取得ミドルウェア（全リクエストで実行）
app.use("*", async (c, next) => {
  if (!secretRepositoryInstance) {
    throw new Error(
      "SecretRepository is not set. Call setSecretRepository() in entry point.",
    );
  }

  // 初回リクエスト時のみ環境変数とシークレットを取得
  if (!cachedEnv || !cachedContainer) {
    const envVars = env<Env["Bindings"]>(c);

    // シークレットを取得（非同期）
    cachedEnv = await validateEnv(envVars, secretRepositoryInstance);

    // DIコンテナのセットアップ
    cachedContainer = setupContainer(
      cachedEnv.DYNAMODB_TABLE_NAME,
      cachedEnv.S3_BUCKET_NAME,
      cachedEnv.AWS_REGION,
      secretRepositoryInstance,
      cachedEnv.S3_ORIGIN_URL,
      cachedEnv.S3_KEY_PREFIX,
    );
  }

  // コンテキストに注入
  c.set("container", cachedContainer);
  c.set("env", cachedEnv);

  await next();
});

// CORS設定（環境変数はコンテキストから取得）
app.use("/*", async (c, next) => {
  const validatedEnv = c.get("env");
  const corsMiddleware = cors({
    origin: validatedEnv.ALLOWED_ORIGINS,
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// グローバルエラーハンドラ
app.onError((err, c) => {
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  if (err instanceof DomainError) {
    return c.json(
      { error: err.message },
      err.statusCode as 400 | 401 | 404 | 409 | 500,
    );
  }

  // Zodバリデーションエラー
  if (err.name === "ZodError") {
    return c.json({ error: "Validation failed", details: err.message }, 400);
  }

  // その他の予期しないエラー
  return c.json({ error: "Internal server error" }, 500);
});

app.get("/api", (c) => {
  return c.json({ message: "Article API" });
});

// 認証ルートをマウント
const authRouter = createAuthRouter();
app.route("/api", authRouter);

// 記事管理ルートをマウント
const articlesRouter = createArticleRouter();
app.route("/api/articles", articlesRouter);

// OGP画像生成ルートをマウント
const ogRouter = createOgRouter();
app.route("/api/og", ogRouter);

// セキュリティスキームの登録
app.openAPIRegistry.registerComponent("securitySchemes", "InitialBearer", {
  type: "apiKey",
  in: "header",
  name: "KCMS-Init-Authorization",
  description: "初期Bearer トークンによる認証（/verify エンドポイント用）",
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "apiKey",
  in: "header",
  name: "KCMS-Authorization",
  description: "JWT トークンによる認証（記事管理エンドポイント用）",
});

// OpenAPIドキュメント生成
app.doc("/api/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Article Management API",
    description: "記事管理のためのREST API",
  },
  tags: [
    {
      name: "Auth",
      description: "認証とJWT トークンの発行",
    },
    {
      name: "Articles",
      description: "記事の作成、取得、更新、削除",
    },
    {
      name: "OGP",
      description: "OGP画像の生成",
    },
  ],
});

// Swagger UIエンドポイント
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

export { app };
