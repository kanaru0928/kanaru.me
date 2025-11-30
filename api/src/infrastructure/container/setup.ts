import { DeleteArticleUseCase } from "../../application/usecases/DeleteArticleUseCase";
import { GetArticleUseCase } from "../../application/usecases/GetArticleUseCase";
import { ListArticlesUseCase } from "../../application/usecases/ListArticlesUseCase";
import { UpsertArticleUseCase } from "../../application/usecases/UpsertArticleUseCase";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";
import type { ISecretRepository } from "../../domain/repositories/ISecretRepository";
import { DynamoDBArticleRepository } from "../repositories/DynamoDBArticleRepository";
import { S3ArticleStorage } from "../storage/S3ArticleStorage";
import { DIContainer } from "./DIContainer";
import { DI_TOKENS } from "./types";

/**
 * DIコンテナをセットアップ
 */
export function setupContainer(
  tableName: string,
  bucketName: string,
  region: string,
  secretRepository: ISecretRepository,
): DIContainer {
  const container = new DIContainer();

  // SecretRepositoryを最初に登録
  container.registerSingleton(
    DI_TOKENS.SecretRepository,
    () => secretRepository,
  );

  // Infrastructure層の登録
  container.registerSingleton(
    DI_TOKENS.ArticleRepository,
    () => new DynamoDBArticleRepository(tableName, region),
  );
  container.registerSingleton(
    DI_TOKENS.ArticleStorage,
    () => new S3ArticleStorage(bucketName, region),
  );

  // Application層の登録
  container.registerSingleton(DI_TOKENS.GetArticleUseCase, () => {
    const repository = container.resolve<IArticleRepository>(
      DI_TOKENS.ArticleRepository,
    );
    const storage = container.resolve<IArticleStorage>(
      DI_TOKENS.ArticleStorage,
    );
    return new GetArticleUseCase(repository, storage);
  });

  container.registerSingleton(DI_TOKENS.ListArticlesUseCase, () => {
    const repository = container.resolve<IArticleRepository>(
      DI_TOKENS.ArticleRepository,
    );
    return new ListArticlesUseCase(repository);
  });

  container.registerSingleton(DI_TOKENS.UpsertArticleUseCase, () => {
    const repository = container.resolve<IArticleRepository>(
      DI_TOKENS.ArticleRepository,
    );
    const storage = container.resolve<IArticleStorage>(
      DI_TOKENS.ArticleStorage,
    );
    return new UpsertArticleUseCase(repository, storage);
  });

  container.registerSingleton(DI_TOKENS.DeleteArticleUseCase, () => {
    const repository = container.resolve<IArticleRepository>(
      DI_TOKENS.ArticleRepository,
    );
    const storage = container.resolve<IArticleStorage>(
      DI_TOKENS.ArticleStorage,
    );
    return new DeleteArticleUseCase(repository, storage);
  });

  return container;
}
