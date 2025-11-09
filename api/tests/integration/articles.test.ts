import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Article } from "../../src/domain/entities/Article";
import { createArticleRouter } from "../../src/interface/routes/articles";
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

type Env = {
	Bindings: {
		DYNAMODB_TABLE_NAME: string;
		S3_BUCKET_NAME: string;
		AWS_REGION: string;
	};
};

describe("Article API Routes", () => {
	let app: Hono<Env>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		mockStorage = createMockArticleStorage();

		// 環境変数をモック
		app = new Hono<Env>();

		// テスト用の環境変数を設定
		app.use("*", async (c, next) => {
			c.env = {
				DYNAMODB_TABLE_NAME: "test-table",
				S3_BUCKET_NAME: "test-bucket",
				AWS_REGION: "us-east-1",
			};
			await next();
		});

		const router = createArticleRouter();
		app.route("/api/articles", router);
	});

	describe("POST /api/articles", () => {
		it("記事を作成できる", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
			vi.mocked(mockStorage.uploadContent).mockResolvedValue(
				"articles/abc12345.md",
			);

			const res = await app.request("/api/articles", {
				method: "POST",
				body: JSON.stringify({
					slug: "test-article",
					title: "Test Article",
					contentBody: "# Test Content",
					author: "Test Author",
					status: "published",
					tags: ["test"],
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(201);
			expect(mockStorage.uploadContent).toHaveBeenCalledWith("# Test Content");
			expect(mockRepository.create).toHaveBeenCalled();

			const json = await res.json();
			expect(json).toHaveProperty("slug", "test-article");
			expect(json).toHaveProperty("title", "Test Article");
		});

		it("重複したslugで記事を作成しようとすると409エラー", async () => {
			const existingArticle: Article = {
				slug: "test-article",
				title: "Existing Article",
				content: "articles/existing.md",
				author: "Author",
				status: "published",
				pv: 0,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: [],
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);

			const res = await app.request("/api/articles", {
				method: "POST",
				body: JSON.stringify({
					slug: "test-article",
					title: "New Article",
					contentBody: "# Content",
					author: "Author",
					status: "published",
					tags: [],
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(409);
			const json = await res.json();
			expect(json).toHaveProperty("error");
		});

		it("バリデーションエラーで400エラー", async () => {
			const res = await app.request("/api/articles", {
				method: "POST",
				body: JSON.stringify({
					slug: "", // 空文字はバリデーションエラー
					title: "Test",
					contentBody: "Content",
					author: "Author",
					status: "published",
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(400);
		});
	});

	describe("GET /api/articles", () => {
		it("記事一覧を取得できる", async () => {
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
			];

			vi.mocked(mockRepository.findAll).mockResolvedValue(mockArticles);

			const res = await app.request("/api/articles");

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveLength(2);
			expect(json[0]).toHaveProperty("slug", "article-1");
			expect(json[1]).toHaveProperty("slug", "article-2");
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

	describe("PATCH /api/articles/:slug", () => {
		it("メタデータを更新できる", async () => {
			const existingArticle: Article = {
				slug: "test-article",
				title: "Old Title",
				content: "articles/abc12345.md",
				author: "Old Author",
				status: "unpublished",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: ["old"],
			};

			const updatedArticle: Article = {
				...existingArticle,
				title: "New Title",
				author: "New Author",
				status: "published",
				tags: ["new"],
				updatedAt: "2025-01-02T00:00:00.000Z",
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);
			vi.mocked(mockRepository.updateMetadata).mockResolvedValue(
				updatedArticle,
			);

			const res = await app.request("/api/articles/test-article", {
				method: "PATCH",
				body: JSON.stringify({
					title: "New Title",
					author: "New Author",
					status: "published",
					tags: ["new"],
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(200);
			const json = await res.json();
			expect(json).toHaveProperty("title", "New Title");
			expect(json).toHaveProperty("author", "New Author");
		});

		it("存在しない記事を更新しようとすると404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const res = await app.request("/api/articles/non-existent", {
				method: "PATCH",
				body: JSON.stringify({ title: "New Title" }),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(404);
		});
	});

	describe("PUT /api/articles/:slug/content", () => {
		it("コンテンツを更新できる", async () => {
			const existingArticle: Article = {
				slug: "test-article",
				title: "Test Article",
				content: "articles/old-hash.md",
				author: "Author",
				status: "published",
				pv: 10,
				createdAt: "2025-01-01T00:00:00.000Z",
				updatedAt: "2025-01-01T00:00:00.000Z",
				tags: [],
			};

			const updatedArticle: Article = {
				...existingArticle,
				content: "articles/new-hash.md",
				updatedAt: "2025-01-02T00:00:00.000Z",
			};

			vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);
			vi.mocked(mockStorage.uploadContent).mockResolvedValue(
				"articles/new-hash.md",
			);
			vi.mocked(mockRepository.updateContentKey).mockResolvedValue(
				updatedArticle,
			);

			const res = await app.request("/api/articles/test-article/content", {
				method: "PUT",
				body: JSON.stringify({
					contentBody: "# New Content",
				}),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(200);
			expect(mockStorage.uploadContent).toHaveBeenCalledWith("# New Content");
			expect(mockRepository.updateContentKey).toHaveBeenCalledWith(
				"test-article",
				"articles/new-hash.md",
			);
		});

		it("存在しない記事のコンテンツを更新しようとすると404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const res = await app.request("/api/articles/non-existent/content", {
				method: "PUT",
				body: JSON.stringify({ contentBody: "New Content" }),
				headers: new Headers({ "Content-Type": "application/json" }),
			});

			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /api/articles/:slug", () => {
		it("記事を削除できる", async () => {
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

			const res = await app.request("/api/articles/test-article", {
				method: "DELETE",
			});

			expect(res.status).toBe(200);
			expect(mockStorage.deleteContent).toHaveBeenCalledWith(
				"articles/abc12345.md",
			);
			expect(mockRepository.delete).toHaveBeenCalledWith("test-article");

			const json = await res.json();
			expect(json).toHaveProperty("message", "Article deleted successfully");
		});

		it("存在しない記事を削除しようとすると404エラー", async () => {
			vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

			const res = await app.request("/api/articles/non-existent", {
				method: "DELETE",
			});

			expect(res.status).toBe(404);
		});
	});
});
