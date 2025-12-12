import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Env as EnvConfig } from "../../src/config/env";
import type { Article } from "../../src/domain/entities/Article";
import { DomainError } from "../../src/domain/errors/DomainError";
import type { setupContainer } from "../../src/infrastructure/container/setup";
import { createOgRouter } from "../../src/interface/routes/og";
import { createMockContainer } from "../mocks/container";
import { createMockArticleRepository } from "../mocks/repositories";
import { createMockArticleStorage } from "../mocks/storage";

// モック用の変数をモジュールスコープで定義
let mockRepository: ReturnType<typeof createMockArticleRepository>;
let mockStorage: ReturnType<typeof createMockArticleStorage>;

// DynamoDBArticleRepository と S3ArticleStorage をモック
vi.mock("../../src/infrastructure/repositories/DynamoDBArticleRepository", () => ({
	DynamoDBArticleRepository: class {
		constructor() {
			return mockRepository;
		}
	},
}));

vi.mock("../../src/infrastructure/storage/S3ArticleStorage", () => ({
	S3ArticleStorage: class {
		constructor() {
			return mockStorage;
		}
	},
}));

// @napi-rs/canvasをモック
vi.mock("@napi-rs/canvas", () => ({
	createCanvas: vi.fn(() => ({
		getContext: vi.fn(() => ({
			drawImage: vi.fn(),
			measureText: vi.fn((text: string) => ({ width: text.length * 30 })),
			fillText: vi.fn(),
			font: "",
			fillStyle: "",
			textAlign: "",
			textBaseline: "",
		})),
		toBuffer: vi.fn(() => Buffer.from("mock-png-data")),
	})),
	loadImage: vi.fn(() => Promise.resolve({})),
	GlobalFonts: {
		registerFromPath: vi.fn(),
	},
}));

type Env = {
	Bindings: {
		DYNAMODB_TABLE_NAME: string;
		S3_BUCKET_NAME: string;
		AWS_REGION: string;
		ALLOWED_ORIGINS: string;
		JWT_SECRET: string;
		JWT_EXPIRES_IN: string;
		INITIAL_BEARER_TOKEN: string;
	};
	Variables: {
		container: ReturnType<typeof setupContainer>;
		env: EnvConfig;
	};
};

describe("OGP Image API Routes", () => {
	let app: Hono<Env>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		mockStorage = createMockArticleStorage();

		// 環境変数とDIコンテナをモック
		app = new Hono<Env>();

		// テスト用のDIコンテナと環境変数を設定
		app.use("*", async (c, next) => {
			const mockContainer = createMockContainer(mockRepository, mockStorage);
			const mockEnvConfig: EnvConfig = {
				DYNAMODB_TABLE_NAME: "test-table",
				S3_BUCKET_NAME: "test-bucket",
				S3_ORIGIN_URL: "https://test-bucket.s3.amazonaws.com",
				S3_KEY_PREFIX: "static/",
				AWS_REGION: "us-east-1",
				ALLOWED_ORIGINS: ["http://localhost:3000"],
				JWT_SECRET: "test-secret",
				JWT_EXPIRES_IN: 86400,
				INITIAL_BEARER_TOKEN: "test-initial-token",
			};

			c.set("container", mockContainer);
			c.set("env", mockEnvConfig);

			await next();
		});

		// グローバルエラーハンドラを設定
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

		// OGルートをマウント
		const ogRouter = createOgRouter();
		app.route("/", ogRouter);
	});

	describe("GET /articles/:slug", () => {
		it("記事のOGP画像を返す", async () => {
			const mockArticle: Article = {
				slug: "test-article",
				title: "テスト記事",
				content: "articles/test.md",
				author: "Test Author",
				status: "published",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: ["test"],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(mockArticle);

			const res = await app.request("/articles/test-article");

			expect(res.status).toBe(200);
			expect(res.headers.get("Content-Type")).toBe("image/png");

			const buffer = await res.arrayBuffer();
			expect(buffer.byteLength).toBeGreaterThan(0);
		});

		it("記事が存在しない場合は404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const res = await app.request("/articles/nonexistent");

			expect(res.status).toBe(404);
			expect(res.headers.get("Content-Type")).toContain("application/json");

			const body = await res.json();
			expect(body).toHaveProperty("error");
		});

		it("長いタイトルの記事でも正常に画像を生成", async () => {
			const mockArticle: Article = {
				slug: "long-title",
				title:
					"これは非常に長いタイトルで、複数行に折り返される可能性があります。",
				content: "articles/long.md",
				author: "Test Author",
				status: "published",
				pv: 5,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: [],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(mockArticle);

			const res = await app.request("/articles/long-title");

			expect(res.status).toBe(200);
			expect(res.headers.get("Content-Type")).toBe("image/png");
		});
	});
});
