import { beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateOgImageUseCase } from "../../src/application/usecases/GenerateOgImageUseCase";
import type { Article } from "../../src/domain/entities/Article";
import { NotFoundError } from "../../src/domain/errors/DomainError";
import { createMockArticleRepository } from "../mocks/repositories";

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

describe("GenerateOgImageUseCase", () => {
	let useCase: GenerateOgImageUseCase;
	let mockRepository: ReturnType<typeof createMockArticleRepository>;

	beforeEach(() => {
		mockRepository = createMockArticleRepository();
		useCase = new GenerateOgImageUseCase(mockRepository);
		vi.clearAllMocks();
	});

	it("記事が存在する場合、PNG画像バッファを返す", async () => {
		const mockArticle: Article = {
			slug: "test-article",
			title: "テスト記事のタイトル",
			content: "articles/test.md",
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
		expect(Buffer.isBuffer(result)).toBe(true);
		expect(result.toString()).toBe("mock-png-data");
	});

	it("記事が存在しない場合、NotFoundErrorをスロー", async () => {
		vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);

		await expect(useCase.execute("nonexistent")).rejects.toThrow(
			NotFoundError,
		);
		await expect(useCase.execute("nonexistent")).rejects.toThrow(
			'Article with slug "nonexistent" not found',
		);
	});

	it("長いタイトルでも正常に処理できる", async () => {
		const mockArticle: Article = {
			slug: "long-title",
			title:
				"これは非常に長いタイトルで、複数行に折り返される可能性があります。テキストの折り返し処理が正しく動作することを確認するためのテストです。",
			content: "articles/long.md",
			author: "Test Author",
			status: "published",
			pv: 5,
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z",
			tags: [],
		};

		vi.mocked(mockRepository.findBySlug).mockResolvedValue(mockArticle);

		const result = await useCase.execute("long-title");

		expect(Buffer.isBuffer(result)).toBe(true);
	});
});
