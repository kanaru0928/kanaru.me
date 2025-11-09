import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class DeleteArticleUseCase {
  constructor(
    private repository: IArticleRepository,
    private storage: IArticleStorage,
  ) {}

  async execute(slug: string): Promise<boolean> {
    // 記事の存在確認
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      return false;
    }

    // S3からコンテンツを削除
    await this.storage.deleteContent(existing.content);

    // メタデータを削除
    await this.repository.delete(slug);

    return true;
  }
}
