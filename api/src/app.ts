import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createArticleRouter } from "./interface/routes/articles";

// 環境変数の型定義
type Env = {
  Bindings: {
    DYNAMODB_TABLE_NAME: string;
    S3_BUCKET_NAME: string;
    AWS_REGION: string;
  };
};

// Honoアプリケーション設定
const app = new OpenAPIHono<Env>();

app.get("/api", (c) => {
  return c.json({ message: "Article API" });
});

// 記事管理ルートをマウント
const articlesRouter = createArticleRouter();
app.route("/", articlesRouter);

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
      name: "Articles",
      description: "記事の作成、取得、更新、削除",
    },
  ],
});

// Swagger UIエンドポイント
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

export { app };
