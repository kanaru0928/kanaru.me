import type { Article, UpdateArticleMetadataInput } from "../entities/Article";

export interface FindAllOptions {
  tags?: string[];
}

export interface IArticleRepository {
  create(article: Article): Promise<void>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(options?: FindAllOptions): Promise<Article[]>;
  upsert(article: Article): Promise<Article>;
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
