import { z } from "@hono/zod-openapi";
import { ArticleConstraints } from "../../domain/entities/Article";

// リクエストボディスキーマ: 記事作成
export const createArticleSchema = z
  .object({
    slug: z
      .string()
      .min(ArticleConstraints.slug.min)
      .max(ArticleConstraints.slug.max),
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
  .openapi("CreateArticle");

// リクエストボディスキーマ: メタデータ更新
export const updateArticleMetadataSchema = z
  .object({
    title: z
      .string()
      .min(ArticleConstraints.title.min)
      .max(ArticleConstraints.title.max)
      .optional(),
    author: z
      .string()
      .min(ArticleConstraints.author.min)
      .max(ArticleConstraints.author.max)
      .optional(),
    status: z.enum(["published", "unpublished"]).optional(),
    tags: z.array(z.string()).optional(),
  })
  .openapi("UpdateArticleMetadata");

// リクエストボディスキーマ: コンテンツ更新
export const updateArticleContentSchema = z
  .object({
    contentBody: z.string().min(ArticleConstraints.contentBody.min),
  })
  .openapi("UpdateArticleContent");

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

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
export type UpdateArticleMetadataSchema = z.infer<
  typeof updateArticleMetadataSchema
>;
export type UpdateArticleContentSchema = z.infer<
  typeof updateArticleContentSchema
>;
export type ListArticlesQuerySchema = z.infer<typeof listArticlesQuerySchema>;
