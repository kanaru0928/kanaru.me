import type {
  Article,
  UpdateArticleContentInput,
} from "../../domain/entities/Article";
import { NotFoundError } from "../../domain/errors/DomainError";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class UpdateArticleContentUseCase {
  constructor(
    private repository: IArticleRepository,
    private storage: IArticleStorage,
  ) {}

  async execute(
    slug: string,
    input: UpdateArticleContentInput,
  ): Promise<Article> {
    // 記事の存在確認
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError(`Article with slug "${slug}" not found`);
    }

    // 新しいコンテンツをS3にアップロード
    const newContentKey = await this.storage.uploadContent(input.contentBody);

    // メタデータのcontentキーを更新
    const metadata = await this.repository.updateContentKey(
      slug,
      newContentKey,
    );
    if (!metadata) {
      throw new Error(`Failed to update metadata for article "${slug}"`);
    }
    return metadata;
  }
}
