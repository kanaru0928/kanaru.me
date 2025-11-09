import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateArticleUseCase } from "../../src/application/usecases/CreateArticleUseCase";
import { createMockArticleRepository } from "../mocks/repositories";
import { createMockArticleStorage } from "../mocks/storage";
import type { Article } from "../../src/domain/entities/Article";

describe("CreateArticleUseCase", () => {
	let useCase: CreateArticleUseCase;
	let mockRepository: ReturnType<typeof createMockArticleRepository>;
	let mockStorage: ReturnType<typeof createMockArticleStorage>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		mockStorage = createMockArticleStorage();
		useCase = new CreateArticleUseCase(mockRepository, mockStorage);
	});

	it("新しい記事を作成できる", async () => {
		vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
		vi.mocked(mockStorage.uploadContent).mockResolvedValue(
			"articles/abc12345.md",
		);

		const input = {
			slug: "test-article",
			title: "Test Article",
			contentBody: "# Test Content",
			author: "Test Author",
			status: "published" as const,
			tags: ["test"],
		};

		const result = await useCase.execute(input);

		expect(mockRepository.findBySlug).toHaveBeenCalledWith("test-article");
		expect(mockStorage.uploadContent).toHaveBeenCalledWith("# Test Content");
		expect(mockRepository.create).toHaveBeenCalled();

		expect(result.slug).toBe("test-article");
		expect(result.title).toBe("Test Article");
		expect(result.content).toBe("articles/abc12345.md");
		expect(result.pv).toBe(0);
		expect(result.createdAt).toBeDefined();
		expect(result.updatedAt).toBeDefined();
	});

	it("既存のslugで記事を作成しようとするとエラー", async () => {
		const existingArticle: Article = {
			slug: "existing-article",
			title: "Existing",
			content: "articles/existing.md",
			author: "Author",
			status: "published",
			pv: 10,
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z",
			tags: [],
		};

		vi.mocked(mockRepository.findBySlug).mockResolvedValue(existingArticle);

		const input = {
			slug: "existing-article",
			title: "New Article",
			contentBody: "# Content",
			author: "Author",
			status: "published" as const,
			tags: [],
		};

		await expect(useCase.execute(input)).rejects.toThrow(
			'Article with slug "existing-article" already exists',
		);
	});
});
