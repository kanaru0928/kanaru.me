import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateArticleContentUseCase } from "../../src/application/usecases/UpdateArticleContentUseCase";
import { NotFoundError } from "../../src/domain/errors/DomainError";
import { createMockArticleRepository } from "../mocks/repositories";
import { createMockArticleStorage } from "../mocks/storage";
import type { Article } from "../../src/domain/entities/Article";

describe("UpdateArticleContentUseCase", () => {
	let useCase: UpdateArticleContentUseCase;
	let mockRepository: ReturnType<typeof createMockArticleRepository>;
	let mockStorage: ReturnType<typeof createMockArticleStorage>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		mockStorage = createMockArticleStorage();
		useCase = new UpdateArticleContentUseCase(mockRepository, mockStorage);
	});

	it("記事のコンテンツを更新できる", async () => {
		const existingArticle: Article = {
			slug: "test-article",
			title: "Test Article",
			content: "articles/old-hash.md",
			author: "Test Author",
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

		const result = await useCase.execute("test-article", {
			contentBody: "# New Content",
		});

		expect(mockRepository.findBySlug).toHaveBeenCalledWith("test-article");
		expect(mockStorage.uploadContent).toHaveBeenCalledWith("# New Content");
		expect(mockRepository.updateContentKey).toHaveBeenCalledWith(
			"test-article",
			"articles/new-hash.md",
		);

		expect(result).not.toBeNull();
		expect(result?.content).toBe("articles/new-hash.md");
	});

	it("存在しない記事のコンテンツを更新しようとするとNotFoundErrorを投げる", async () => {
		vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

		await expect(
			useCase.execute("non-existent", {
				contentBody: "# Content",
			}),
		).rejects.toThrow(NotFoundError);

		expect(mockStorage.uploadContent).not.toHaveBeenCalled();
		expect(mockRepository.updateContentKey).not.toHaveBeenCalled();
	});
});
