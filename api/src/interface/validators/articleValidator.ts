import { z } from "@hono/zod-openapi";

// リクエストボディスキーマ: 記事作成
export const createArticleSchema = z
  .object({
    slug: z.string().min(1).max(100),
    title: z.string().min(1).max(200),
    contentBody: z.string().min(1),
    author: z.string().min(1).max(100),
    status: z.enum(["published", "unpublished"]),
    tags: z.array(z.string()).default([]),
  })
  .openapi("CreateArticle");

// リクエストボディスキーマ: メタデータ更新
export const updateArticleMetadataSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(100).optional(),
    status: z.enum(["published", "unpublished"]).optional(),
    tags: z.array(z.string()).optional(),
  })
  .openapi("UpdateArticleMetadata");

// リクエストボディスキーマ: コンテンツ更新
export const updateArticleContentSchema = z
  .object({
    contentBody: z.string().min(1),
  })
  .openapi("UpdateArticleContent");

// パスパラメータスキーマ
export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
export type UpdateArticleMetadataSchema = z.infer<
  typeof updateArticleMetadataSchema
>;
export type UpdateArticleContentSchema = z.infer<
  typeof updateArticleContentSchema
>;
