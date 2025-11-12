import type { Article } from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export interface ListArticlesOptions {
  isAuthenticated: boolean;
  tags?: string[];
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export class ListArticlesUseCase {
  constructor(private repository: IArticleRepository) {}

  async execute(options: ListArticlesOptions): Promise<Article[]> {
    const { isAuthenticated, tags, sortBy, order = "desc" } = options;

    // リポジトリから記事を取得（タグフィルタ適用）
    let articles = await this.repository.findAll(tags ? { tags } : undefined);

    // 認証されていない場合は公開済み記事のみフィルタ
    if (!isAuthenticated) {
      articles = articles.filter((article) => article.status === "published");
    }

    // ソート処理
    if (sortBy) {
      articles.sort((a, b) => {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return articles;
  }
}
