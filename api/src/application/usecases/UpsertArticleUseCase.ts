import type {
  Article,
  UpsertArticleInput,
} from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export interface UpsertArticleResult {
  article: Article;
  isNew: boolean;
}

export class UpsertArticleUseCase {
  constructor(
    private repository: IArticleRepository,
    private storage: IArticleStorage,
  ) {}

  async execute(
    slug: string,
    input: UpsertArticleInput,
  ): Promise<UpsertArticleResult> {
    // 既存記事を取得
    const existing = await this.repository.findBySlug(slug);

    // S3に新しいコンテンツをアップロード
    const contentKey = await this.storage.uploadContent(input.contentBody);

    // メタデータを構築
    const now = new Date().toISOString();
    const article: Article = {
      slug,
      title: input.title,
      content: contentKey,
      author: input.author,
      status: input.status,
      pv: existing?.pv ?? 0,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      tags: input.tags,
    };

    // DynamoDBにupsert
    await this.repository.upsert(article);

    return { article, isNew: !existing };
  }
}
