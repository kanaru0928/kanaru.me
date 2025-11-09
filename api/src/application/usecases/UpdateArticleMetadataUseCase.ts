import type {
  Article,
  UpdateArticleMetadataInput,
} from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class UpdateArticleMetadataUseCase {
  constructor(private repository: IArticleRepository) {}

  async execute(
    slug: string,
    input: UpdateArticleMetadataInput,
  ): Promise<Article | null> {
    // 記事の存在確認
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      return null;
    }

    // メタデータのみ更新
    return this.repository.updateMetadata(slug, input);
  }
}
