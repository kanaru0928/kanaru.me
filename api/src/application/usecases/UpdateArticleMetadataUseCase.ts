import type {
  Article,
  UpdateArticleMetadataInput,
} from "../../domain/entities/Article";
import { NotFoundError } from "../../domain/errors/DomainError";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class UpdateArticleMetadataUseCase {
  constructor(private repository: IArticleRepository) {}

  async execute(
    slug: string,
    input: UpdateArticleMetadataInput,
  ): Promise<Article> {
    // 記事の存在確認
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError(`Article with slug "${slug}" not found`);
    }

    // メタデータのみ更新
    const updated = await this.repository.updateMetadata(slug, input);
    if (!updated) {
      throw new Error(`Failed to update metadata for article "${slug}"`);
    }
    return updated;
  }
}
