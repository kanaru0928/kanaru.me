import type { Article } from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class ListArticlesUseCase {
  constructor(private repository: IArticleRepository) {}

  async execute(): Promise<Article[]> {
    return this.repository.findAll();
  }
}
