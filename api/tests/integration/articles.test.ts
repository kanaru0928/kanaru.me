import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Env as EnvConfig } from "../../src/config/env";
import type { Article } from "../../src/domain/entities/Article";
import { DomainError } from "../../src/domain/errors/DomainError";
import type { setupContainer } from "../../src/infrastructure/container/setup";
import { createArticleRouter } from "../../src/interface/routes/articles";
import { createMockContainer } from "../mocks/container";
import { createMockArticleRepository } from "../mocks/repositories";
import { createMockArticleStorage } from "../mocks/storage";
import {
	createAuthHeader,
	generateExpiredJwt,
	generateTestJwt,
} from "./helpers";

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

describe("Article API Routes", () => {
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

		const router = createArticleRouter();
		app.route("/api/articles", router);
	});

	describe("PUT /api/articles/:slug", () => {
		it("有効なJWTで記事を作成できる（upsert - 新規）", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
			vi.mocked(mockStorage.uploadContent).mockResolvedValue(
				"articles/abc12345.md",
			);

			const token = await generateTestJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "Test Article",
					contentBody: "# Test Content",
					author: "Test Author",
					status: "published",
					tags: ["test"],
				}),
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(201);
			expect(mockStorage.uploadContent).toHaveBeenCalledWith("# Test Content");
			expect(mockRepository.upsert).toHaveBeenCalled();

			const json = await res.json();
			expect(json).toHaveProperty("slug", "test-article");
			expect(json).toHaveProperty("title", "Test Article");
		});

		it("有効なJWTで記事を更新できる（upsert - 更新）", async () => {
			const existingArticle: Article = {
				slug: "test-article",
				title: "Old Title",
				content: "articles/old-hash.md",
				author: "Old Author",
				status: "unpublished",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: ["old"],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);
			vi.mocked(mockStorage.uploadContent).mockResolvedValue(
				"articles/new-hash.md",
			);

			const token = await generateTestJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "New Title",
					contentBody: "# New Content",
					author: "New Author",
					status: "published",
					tags: ["new"],
				}),
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(200);
			expect(mockStorage.uploadContent).toHaveBeenCalledWith("# New Content");
			expect(mockRepository.upsert).toHaveBeenCalled();

			const json = await res.json();
			expect(json).toHaveProperty("title", "New Title");
			expect(json).toHaveProperty("author", "New Author");
		});

		it("JWTなしで 401 エラー", async () => {
			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "Test Article",
					contentBody: "# Test Content",
					author: "Test Author",
					status: "published",
					tags: ["test"],
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(401);
		});

		it("不正なJWTで 401 エラー", async () => {
			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "Test Article",
					contentBody: "# Test Content",
					author: "Test Author",
					status: "published",
					tags: ["test"],
				}),
				headers: createAuthHeader("invalid-token"),
			});

			expect(res.status).toBe(401);
		});

		it("期限切れJWTで 401 エラー", async () => {
			const expiredToken = await generateExpiredJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "Test Article",
					contentBody: "# Test Content",
					author: "Test Author",
					status: "published",
					tags: ["test"],
				}),
				headers: createAuthHeader(expiredToken),
			});

			expect(res.status).toBe(401);
		});

		it("バリデーションエラーで400エラー", async () => {
			const token = await generateTestJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "PUT",
				body: JSON.stringify({
					title: "", // 空文字はバリデーションエラー
					contentBody: "Content",
					author: "Author",
					status: "published",
					tags: [],
				}),
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(400);
		});
	});

	describe("GET /api/articles", () => {
		const mockArticles: Article[] = [
			{
				slug: "article-1",
				title: "Article 1",
				content: "articles/abc1.md",
				author: "Author 1",
				status: "published",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: ["tag1"],
			},
			{
				slug: "article-2",
				title: "Article 2",
				content: "articles/abc2.md",
				author: "Author 2",
				status: "unpublished",
				pv: 5,
				createdAt: "2025-01-02T00:00:00.000Z",
				updatedAt: "2025-01-02T00:00:00.000Z",
				tags: ["tag2"],
			},
			{
				slug: "article-3",
				title: "Article 3",
				content: "articles/abc3.md",
				author: "Author 3",
				status: "published",
				pv: 15,
				createdAt: "2025-01-03T00:00:00.000Z",
				updatedAt: "2025-01-03T00:00:00.000Z",
				tags: ["tag1", "tag3"],
			},
		];

		it("認証なしでは公開済み記事のみ取得できる", async () => {
			vi.mocked(mockRepository.findAll).mockResolvedValue(mockArticles);

			const res = await app.request("/api/articles");

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveLength(2);
			expect(json[0]).toHaveProperty("slug", "article-1");
			expect(json[0]).toHaveProperty("status", "published");
			expect(json[1]).toHaveProperty("slug", "article-3");
			expect(json[1]).toHaveProperty("status", "published");
		});

		it("認証ありでは全ての記事を取得できる", async () => {
			const token = await generateTestJwt("test-secret");
			vi.mocked(mockRepository.findAll).mockResolvedValue(mockArticles);

			const res = await app.request("/api/articles", {
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveLength(3);
			expect(json.some((a: { status: string }) => a.status === "unpublished")).toBe(
				true,
			);
		});

		it("タグでフィルタできる", async () => {
			vi.mocked(mockRepository.findAll).mockResolvedValue([
				mockArticles[0],
				mockArticles[2],
			]);

			const res = await app.request("/api/articles?tag=tag1");

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveLength(2);
			expect(json[0]).toHaveProperty("slug", "article-1");
			expect(json[1]).toHaveProperty("slug", "article-3");
		});

		it("createdAtでソートできる（降順）", async () => {
			vi.mocked(mockRepository.findAll).mockResolvedValue([
				mockArticles[0],
				mockArticles[2],
			]);

			const res = await app.request(
				"/api/articles?sortBy=createdAt&order=desc",
			);

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json[0]).toHaveProperty("slug", "article-3");
			expect(json[1]).toHaveProperty("slug", "article-1");
		});

		it("createdAtでソートできる（昇順）", async () => {
			vi.mocked(mockRepository.findAll).mockResolvedValue([
				mockArticles[0],
				mockArticles[2],
			]);

			const res = await app.request("/api/articles?sortBy=createdAt&order=asc");

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json[0]).toHaveProperty("slug", "article-1");
			expect(json[1]).toHaveProperty("slug", "article-3");
		});

		it("updatedAtでソートできる", async () => {
			vi.mocked(mockRepository.findAll).mockResolvedValue([
				mockArticles[0],
				mockArticles[2],
			]);

			const res = await app.request(
				"/api/articles?sortBy=updatedAt&order=desc",
			);

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json[0]).toHaveProperty("slug", "article-3");
		});
	});

	describe("GET /api/articles/:slug", () => {
		it("記事詳細を取得できる", async () => {
			const mockArticle: Article = {
				slug: "test-article",
				title: "Test Article",
				content: "articles/abc12345.md",
				author: "Test Author",
				status: "published",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: ["test"],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(mockArticle);
			vi.mocked(mockStorage.getContent).mockResolvedValue("# Test Content");

			const res = await app.request("/api/articles/test-article");

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveProperty("slug", "test-article");
			expect(json).toHaveProperty("contentBody", "# Test Content");
		});

		it("存在しない記事にアクセスすると404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const res = await app.request("/api/articles/non-existent");

			expect(res.status).toBe(404);
			const json = await res.json();
			expect(json).toHaveProperty("error", "Article not found");
		});
	});


	describe("DELETE /api/articles/:slug", () => {
		it("有効なJWTで記事を削除できる", async () => {
			const existingArticle: Article = {
				slug: "test-article",
				title: "Test Article",
				content: "articles/abc12345.md",
				author: "Author",
				status: "published",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: [],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);

			const token = await generateTestJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "DELETE",
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(200);
			expect(mockStorage.deleteContent).toHaveBeenCalledWith(
				"articles/abc12345.md",
			);
			expect(mockRepository.delete).toHaveBeenCalledWith("test-article");

			const json = await res.json();
			expect(json).toHaveProperty("message", "Article deleted successfully");
		});

		it("JWTなしで 401 エラー", async () => {
			const res = await app.request("/api/articles/test-article", {
				method: "DELETE",
			});

			expect(res.status).toBe(401);
		});

		it("不正なJWTで 401 エラー", async () => {
			const res = await app.request("/api/articles/test-article", {
				method: "DELETE",
				headers: createAuthHeader("invalid-token"),
			});

			expect(res.status).toBe(401);
		});

		it("期限切れJWTで 401 エラー", async () => {
			const expiredToken = await generateExpiredJwt("test-secret");

			const res = await app.request("/api/articles/test-article", {
				method: "DELETE",
				headers: createAuthHeader(expiredToken),
			});

			expect(res.status).toBe(401);
		});

		it("存在しない記事を削除しようとすると404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const token = await generateTestJwt("test-secret");

			const res = await app.request("/api/articles/non-existent", {
				method: "DELETE",
				headers: createAuthHeader(token),
			});

			expect(res.status).toBe(404);
		});
	});
});
