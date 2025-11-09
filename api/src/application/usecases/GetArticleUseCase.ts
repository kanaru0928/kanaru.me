import type { Article } from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export interface ArticleWithContent extends Article {
  contentBody: string;
}

export class GetArticleUseCase {
  constructor(
    private repository: IArticleRepository,
    private storage: IArticleStorage,
  ) {}

  async execute(slug: string): Promise<ArticleWithContent | null> {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      return null;
    }

    // S3からコンテンツを取得
    const contentBody = await this.storage.getContent(article.content);
    if (!contentBody) {
      throw new Error(`Content not found for article "${slug}"`);
    }

    return {
      ...article,
      contentBody,
    };
  }
}
