import { CreateArticleUseCase } from "../../src/application/usecases/CreateArticleUseCase";
import { DeleteArticleUseCase } from "../../src/application/usecases/DeleteArticleUseCase";
import { GetArticleUseCase } from "../../src/application/usecases/GetArticleUseCase";
import { ListArticlesUseCase } from "../../src/application/usecases/ListArticlesUseCase";
import { UpdateArticleContentUseCase } from "../../src/application/usecases/UpdateArticleContentUseCase";
import { UpdateArticleMetadataUseCase } from "../../src/application/usecases/UpdateArticleMetadataUseCase";
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
		DI_TOKENS.CreateArticleUseCase,
		() => new CreateArticleUseCase(mockRepository, mockStorage),
	);

	container.registerSingleton(
		DI_TOKENS.GetArticleUseCase,
		() => new GetArticleUseCase(mockRepository, mockStorage),
	);

	container.registerSingleton(
		DI_TOKENS.ListArticlesUseCase,
		() => new ListArticlesUseCase(mockRepository),
	);

	container.registerSingleton(
		DI_TOKENS.UpdateArticleMetadataUseCase,
		() => new UpdateArticleMetadataUseCase(mockRepository),
	);

	container.registerSingleton(
		DI_TOKENS.UpdateArticleContentUseCase,
		() => new UpdateArticleContentUseCase(mockRepository, mockStorage),
	);

	container.registerSingleton(
		DI_TOKENS.DeleteArticleUseCase,
		() => new DeleteArticleUseCase(mockRepository, mockStorage),
	);

	return container;
}
