import { vi } from "vitest";
import type { IArticleStorage } from "../../src/domain/repositories/IArticleStorage";

export function createMockArticleStorage(): IArticleStorage {
	return {
		uploadContent: vi
			.fn()
			.mockResolvedValue("articles/abc12345def67890.md"),
		getContent: vi.fn().mockResolvedValue("# Test Content"),
		deleteContent: vi.fn().mockResolvedValue(undefined),
	};
}
