import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import type { Env as EnvConfig } from "./config/env";
import { validateEnv } from "./config/env";
import { DomainError } from "./domain/errors/DomainError";
import { setupContainer } from "./infrastructure/container/setup";
import { createArticleRouter } from "./interface/routes/articles";

// 環境変数の型定義
export type Env = {
	Bindings: {
		DYNAMODB_TABLE_NAME: string;
		S3_BUCKET_NAME: string;
		AWS_REGION: string;
		ALLOWED_ORIGINS: string;
	};
	Variables: {
		container: ReturnType<typeof setupContainer>;
		env: EnvConfig;
	};
};

// Lambda/開発環境用のアプリケーション
// 環境変数はミドルウェアで動的に取得するため、createApp関数は削除し直接アプリを構築
const app = new OpenAPIHono<Env>();

// DIコンテナのキャッシュ（初回リクエスト時に作成し再利用）
let containerCache: ReturnType<typeof setupContainer> | null = null;
let envCache: EnvConfig | null = null;

// 環境変数取得ミドルウェア（全リクエストで実行）
app.use("*", async (c, next) => {
	// キャッシュがあればそれを使用
	if (containerCache && envCache) {
		c.set("container", containerCache);
		c.set("env", envCache);
		await next();
		return;
	}

	// 初回のみ環境変数を取得してコンテナをセットアップ
	const envVars = env<Env["Bindings"]>(c);

	// 環境変数のバリデーション
	const validatedEnv = validateEnv(envVars);

	// DIコンテナのセットアップ
	const container = setupContainer(
		validatedEnv.DYNAMODB_TABLE_NAME,
		validatedEnv.S3_BUCKET_NAME,
		validatedEnv.AWS_REGION,
	);

	// キャッシュに保存
	containerCache = container;
	envCache = validatedEnv;

	// コンテキストに注入
	c.set("container", container);
	c.set("env", validatedEnv);

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
	console.error("Error:", err);

	if (err instanceof DomainError) {
		return c.json(
			{ error: err.message },
			err.statusCode as 400 | 404 | 409 | 500,
		);
	}

	return c.json({ error: "Internal server error" }, 500);
});

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
