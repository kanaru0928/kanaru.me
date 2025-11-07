import { vi } from "vitest";
import type { IArticleStorage } from "../../src/domain/repositories/IArticleStorage";

export function createMockArticleStorage(): IArticleStorage {
	return {
		generateContentKey: vi.fn((content: string) => {
			return `articles/${content.substring(0, 8)}.md`;
		}),
		uploadContent: vi
			.fn()
			.mockResolvedValue("articles/abc12345def67890.md"),
		getContent: vi.fn().mockResolvedValue("# Test Content"),
		deleteContent: vi.fn().mockResolvedValue(undefined),
	};
}
