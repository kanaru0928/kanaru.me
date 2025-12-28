import { DeleteArticleUseCase } from "../../src/application/usecases/DeleteArticleUseCase";
import { GenerateOgImageUseCase } from "../../src/application/usecases/GenerateOgImageUseCase";
import { GetArticleUseCase } from "../../src/application/usecases/GetArticleUseCase";
import { ListArticlesUseCase } from "../../src/application/usecases/ListArticlesUseCase";
import { UpsertArticleUseCase } from "../../src/application/usecases/UpsertArticleUseCase";
import { DIContainer } from "../../src/infrastructure/container/DIContainer";
import { DI_TOKENS } from "../../src/infrastructure/container/types";
import type { createMockArticleRepository } from "./repositories";
import type { createMockArticleStorage } from "./storage";

/**
 * テスト用のDIコンテナを作成
 */
export function createMockContainer(
	mockRepository: ReturnType<typeof createMockArticleRepository>,
	mockStorage: ReturnType<typeof createMockArticleStorage>,
): DIContainer {
	const container = new DIContainer();

	// モックリポジトリとストレージを登録
	container.registerSingleton(DI_TOKENS.ArticleRepository, () => mockRepository);
	container.registerSingleton(DI_TOKENS.ArticleStorage, () => mockStorage);

	// UseCaseを登録（モックリポジトリとストレージを注入）
	container.registerSingleton(
		DI_TOKENS.GetArticleUseCase,
		() => new GetArticleUseCase(mockRepository),
	);

	container.registerSingleton(
		DI_TOKENS.ListArticlesUseCase,
		() => new ListArticlesUseCase(mockRepository),
	);

	container.registerSingleton(
		DI_TOKENS.UpsertArticleUseCase,
		() => new UpsertArticleUseCase(mockRepository, mockStorage),
	);

	container.registerSingleton(
		DI_TOKENS.DeleteArticleUseCase,
		() => new DeleteArticleUseCase(mockRepository, mockStorage),
	);

	container.registerSingleton(
		DI_TOKENS.GenerateOgImageUseCase,
		() => new GenerateOgImageUseCase(mockRepository),
	);

	return container;
}
