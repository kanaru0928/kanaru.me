import { Hono } from "hono";
import { describe, it, expect, beforeEach } from "vitest";
import { decode } from "hono/jwt";
import type { Env, EnvConfig } from "../../src/app";
import { createAuthRouter } from "../../src/interface/routes/auth";

describe("Authentication API", () => {
	let app: Hono<Env>;
	const mockEnvConfig: EnvConfig = {
		DYNAMODB_TABLE_NAME: "test-table",
		S3_BUCKET_NAME: "test-bucket",
		AWS_REGION: "us-east-1",
		ALLOWED_ORIGINS: ["http://localhost:3000"],
		JWT_SECRET: "test-secret-key",
		JWT_EXPIRES_IN: "24h",
		INITIAL_BEARER_TOKEN: "test-initial-token",
	};

	beforeEach(() => {
		app = new Hono<Env>();

		// 環境変数をモック
		app.use("*", async (c, next) => {
			c.set("env", mockEnvConfig);
			await next();
		});

		// 認証ルーターをマウント
		const authRouter = createAuthRouter();
		app.route("/api", authRouter);
	});

	describe("POST /api/verify", () => {
		it("正しい初期Bearerトークンで JWT を取得できる", async () => {
			const res = await app.request("/api/verify", {
				method: "POST",
				headers: new Headers({
					Authorization: `Bearer ${mockEnvConfig.INITIAL_BEARER_TOKEN}`,
				}),
			});

			expect(res.status).toBe(200);

			const data = await res.json();
			expect(data).toHaveProperty("token");
			expect(data).toHaveProperty("expiresIn", "24h");

			// JWTのペイロードを検証
			const { payload } = decode(data.token);
			expect(payload).toHaveProperty("sub", "api-user");
			expect(payload).toHaveProperty("iat");
			expect(payload).toHaveProperty("exp");

			// 有効期限が24時間後であることを確認
			const iat = payload.iat as number;
			const exp = payload.exp as number;
			expect(exp - iat).toBe(24 * 60 * 60);
		});

		it("Authorization ヘッダーがない場合は 401 エラー", async () => {
			const res = await app.request("/api/verify", {
				method: "POST",
			});

			expect(res.status).toBe(401);

			const data = await res.json();
			expect(data).toHaveProperty("error", "Authorization header is required");
		});

		it("Bearer スキームがない場合は 401 エラー", async () => {
			const res = await app.request("/api/verify", {
				method: "POST",
				headers: new Headers({
					Authorization: mockEnvConfig.INITIAL_BEARER_TOKEN, // "Bearer" なし
				}),
			});

			expect(res.status).toBe(401);

			const data = await res.json();
			expect(data).toHaveProperty(
				"error",
				"Invalid authorization format. Expected 'Bearer <token>'",
			);
		});

		it("不正な初期Bearerトークンで 401 エラー", async () => {
			const res = await app.request("/api/verify", {
				method: "POST",
				headers: new Headers({
					Authorization: "Bearer invalid-token",
				}),
			});

			expect(res.status).toBe(401);

			const data = await res.json();
			expect(data).toHaveProperty("error", "Invalid bearer token");
		});
	});
});
