import { z } from "@hono/zod-openapi";
import { ArticleConstraints } from "../../domain/entities/Article";

// リクエストボディスキーマ: 記事のupsert
export const upsertArticleSchema = z
  .object({
    title: z
      .string()
      .min(ArticleConstraints.title.min)
      .max(ArticleConstraints.title.max),
    contentBody: z.string().min(ArticleConstraints.contentBody.min),
    author: z
      .string()
      .min(ArticleConstraints.author.min)
      .max(ArticleConstraints.author.max),
    status: z.enum(["published", "unpublished"]),
    tags: z.array(z.string()).default([]),
  })
  .openapi("UpsertArticle");

// パスパラメータスキーマ
export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

// クエリパラメータスキーマ: 記事一覧取得
export const listArticlesQuerySchema = z.object({
  tag: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type UpsertArticleSchema = z.infer<typeof upsertArticleSchema>;
export type ListArticlesQuerySchema = z.infer<typeof listArticlesQuerySchema>;
