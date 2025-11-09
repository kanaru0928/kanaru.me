import type { Article, UpdateArticleMetadataInput } from "../entities/Article";

export interface IArticleRepository {
  create(article: Article): Promise<void>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(): Promise<Article[]>;
  updateMetadata(
    slug: string,
    input: UpdateArticleMetadataInput,
  ): Promise<Article | null>;
  updateContentKey(
    slug: string,
    newContentKey: string,
  ): Promise<Article | null>;
  incrementPV(slug: string): Promise<void>;
  delete(slug: string): Promise<void>;
}
