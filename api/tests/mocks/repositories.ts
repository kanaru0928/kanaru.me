import { vi } from "vitest";
import type { IArticleRepository } from "../../src/domain/repositories/IArticleRepository";

export function createMockArticleRepository(): IArticleRepository {
	return {
		create: vi.fn().mockResolvedValue(undefined),
		findBySlug: vi.fn().mockResolvedValue(null),
		findAll: vi.fn().mockResolvedValue([]),
		updateMetadata: vi.fn().mockResolvedValue(null),
		updateContentKey: vi.fn().mockResolvedValue(null),
		incrementPV: vi.fn().mockResolvedValue(undefined),
		delete: vi.fn().mockResolvedValue(undefined),
	};
}
