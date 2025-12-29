import type { Article } from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class GetArticleUseCase {
  constructor(private repository: IArticleRepository) {}

  async execute(slug: string): Promise<Article | null> {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      return null;
    }

    // PVを自動インクリメント（非同期で実行、エラーは無視）
    this.repository.incrementPV(slug).catch((err) => {
      console.error(`Failed to increment PV for article "${slug}":`, err);
    });

    return article;
  }
}
