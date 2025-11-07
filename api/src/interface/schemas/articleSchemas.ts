import { z } from "@hono/zod-openapi";

// レスポンススキーマ: 記事一覧アイテム
export const ArticleListItemSchema = z
	.object({
		slug: z.string().openapi({ example: "my-first-article" }),
		title: z.string().openapi({ example: "私の最初の記事" }),
		author: z.string().openapi({ example: "山田太郎" }),
		status: z.enum(["published", "unpublished"]).openapi({ example: "published" }),
		pv: z.number().openapi({ example: 42 }),
		createdAt: z.string().openapi({ example: "2025-01-01T00:00:00.000Z" }),
		updatedAt: z.string().openapi({ example: "2025-01-02T12:34:56.000Z" }),
		tags: z.array(z.string()).openapi({ example: ["TypeScript", "Hono"] }),
	})
	.openapi("ArticleListItem");

// レスポンススキーマ: 記事詳細
export const ArticleDetailSchema = z
	.object({
		slug: z.string().openapi({ example: "my-first-article" }),
		title: z.string().openapi({ example: "私の最初の記事" }),
		author: z.string().openapi({ example: "山田太郎" }),
		status: z.enum(["published", "unpublished"]).openapi({ example: "published" }),
		pv: z.number().openapi({ example: 42 }),
		createdAt: z.string().openapi({ example: "2025-01-01T00:00:00.000Z" }),
		updatedAt: z.string().openapi({ example: "2025-01-02T12:34:56.000Z" }),
		tags: z.array(z.string()).openapi({ example: ["TypeScript", "Hono"] }),
		contentBody: z.string().openapi({ example: "# はじめに\n\nこれは記事本文です。" }),
	})
	.openapi("ArticleDetail");

// エラーレスポンススキーマ
export const ErrorSchema = z
	.object({
		error: z.string().openapi({ example: "Article not found" }),
	})
	.openapi("Error");

// 削除成功レスポンススキーマ
export const DeleteSuccessSchema = z
	.object({
		message: z.string().openapi({ example: "Article deleted successfully" }),
	})
	.openapi("DeleteSuccess");
