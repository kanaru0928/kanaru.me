import { NotFoundError } from "../../domain/errors/DomainError";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class DeleteArticleUseCase {
  constructor(
    private repository: IArticleRepository,
    private storage: IArticleStorage,
  ) {}

  async execute(slug: string): Promise<void> {
    // 記事の存在確認
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError(`Article with slug "${slug}" not found`);
    }

    let deletedFromRepository = false;

    try {
      // DynamoDBからメタデータを削除
      await this.repository.delete(slug);
      deletedFromRepository = true;

      // S3からコンテンツを削除
      await this.storage.deleteContent(existing.content);
    } catch (error) {
      // S3削除失敗時のロールバック
      if (deletedFromRepository) {
        try {
          // DynamoDBに記事を復元
          await this.repository.create(existing);
          console.error(
            `Rolled back article "${slug}" deletion after S3 failure`,
          );
        } catch (rollbackError) {
          console.error(
            `Critical: Failed to rollback article "${slug}" after S3 deletion failure`,
            rollbackError,
          );
        }
      }

      throw error;
    }
  }
}
