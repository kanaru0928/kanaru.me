import type { ArticleWithContent } from "../../application/usecases/GetArticleUseCase";
import type { Article } from "../../domain/entities/Article";

export interface ArticleListItemDTO {
  slug: string;
  title: string;
  author: string;
  status: "published" | "unpublished";
  pv: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ArticleDetailDTO extends ArticleListItemDTO {
  contentBody: string;
}

export function toArticleListItem(article: Article): ArticleListItemDTO {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    status: article.status,
    pv: article.pv,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    tags: article.tags,
  };
}

export function toArticleDetail(article: ArticleWithContent): ArticleDetailDTO {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    status: article.status,
    pv: article.pv,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    tags: article.tags,
    contentBody: article.contentBody,
  };
}
