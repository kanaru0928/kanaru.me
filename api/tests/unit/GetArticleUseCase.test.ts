import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetArticleUseCase } from "../../src/application/usecases/GetArticleUseCase";
import { createMockArticleRepository } from "../mocks/repositories";
import { createMockArticleStorage } from "../mocks/storage";
import type { Article } from "../../src/domain/entities/Article";

describe("GetArticleUseCase", () => {
	let useCase: GetArticleUseCase;
	let mockRepository: ReturnType<typeof createMockArticleRepository>;
	let mockStorage: ReturnType<typeof createMockArticleStorage>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		mockStorage = createMockArticleStorage();
		useCase = new GetArticleUseCase(mockRepository);
	});

	it("記事とコンテンツを取得できる", async () => {
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

		const result = await useCase.execute("test-article");

		expect(mockRepository.findBySlug).toHaveBeenCalledWith("test-article");

		expect(result).not.toBeNull();
		expect(result?.slug).toBe("test-article");
		expect(result?.title).toBe("Test Article");
		expect(result?.content).toBe("articles/abc12345.md");
	});

	it("存在しない記事を取得しようとするとnullを返す", async () => {
		vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

		const result = await useCase.execute("non-existent");

		expect(result).toBeNull();
		expect(mockStorage.getContent).not.toHaveBeenCalled();
	});
});
