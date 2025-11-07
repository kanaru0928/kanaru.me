import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import type { CreateArticleUseCase } from "../../application/usecases/CreateArticleUseCase";
import type { GetArticleUseCase } from "../../application/usecases/GetArticleUseCase";
import type { ListArticlesUseCase } from "../../application/usecases/ListArticlesUseCase";
import type { UpdateArticleMetadataUseCase } from "../../application/usecases/UpdateArticleMetadataUseCase";
import type { UpdateArticleContentUseCase } from "../../application/usecases/UpdateArticleContentUseCase";
import type { DeleteArticleUseCase } from "../../application/usecases/DeleteArticleUseCase";
import { ArticleDTO } from "../dto/ArticleDTO";
import {
	createArticleSchema,
	updateArticleContentSchema,
	updateArticleMetadataSchema,
	slugParamSchema,
} from "../validators/articleValidator";
import {
	ArticleListItemSchema,
	ArticleDetailSchema,
	ErrorSchema,
	DeleteSuccessSchema,
} from "../schemas/articleSchemas";

export interface ArticleUseCases {
	createArticleUseCase: CreateArticleUseCase;
	getArticleUseCase: GetArticleUseCase;
	listArticlesUseCase: ListArticlesUseCase;
	updateArticleMetadataUseCase: UpdateArticleMetadataUseCase;
	updateArticleContentUseCase: UpdateArticleContentUseCase;
	deleteArticleUseCase: DeleteArticleUseCase;
}

export function createArticleRouter(useCases: ArticleUseCases) {
	const app = new OpenAPIHono();

	// ルート定義: 記事一覧取得
	const listArticlesRoute = createRoute({
		method: "get",
		path: "/",
		tags: ["Articles"],
		summary: "記事一覧を取得",
		description: "公開・非公開を含む全ての記事の一覧を取得します",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(ArticleListItemSchema),
					},
				},
				description: "記事一覧の取得に成功",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(listArticlesRoute, async (c) => {
		try {
			const articles = await useCases.listArticlesUseCase.execute();
			return c.json(articles.map((a) => ArticleDTO.toListItem(a)), 200);
		} catch (error) {
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	// ルート定義: 記事作成
	const createArticleRoute = createRoute({
		method: "post",
		path: "/",
		tags: ["Articles"],
		summary: "記事を作成",
		description: "新しい記事を作成します",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createArticleSchema,
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: ArticleListItemSchema,
					},
				},
				description: "記事の作成に成功",
			},
			409: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "指定されたスラッグの記事が既に存在",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(createArticleRoute, async (c) => {
		try {
			const input = c.req.valid("json");
			const article = await useCases.createArticleUseCase.execute(input);
			return c.json(ArticleDTO.toListItem(article), 201);
		} catch (error) {
			if (error instanceof Error && error.message.includes("already exists")) {
				return c.json({ error: error.message }, 409);
			}
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	// ルート定義: 記事詳細取得
	const getArticleRoute = createRoute({
		method: "get",
		path: "/{slug}",
		tags: ["Articles"],
		summary: "記事詳細を取得",
		description: "指定されたスラッグの記事詳細を取得します",
		request: {
			params: slugParamSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: ArticleDetailSchema,
					},
				},
				description: "記事詳細の取得に成功",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "記事が見つからない",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(getArticleRoute, async (c) => {
		try {
			const { slug } = c.req.valid("param");
			const article = await useCases.getArticleUseCase.execute(slug);

			if (!article) {
				return c.json({ error: "Article not found" }, 404);
			}

			return c.json(ArticleDTO.toDetail(article), 200);
		} catch (error) {
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	// ルート定義: メタデータ更新
	const updateArticleMetadataRoute = createRoute({
		method: "patch",
		path: "/{slug}",
		tags: ["Articles"],
		summary: "記事のメタデータを更新",
		description: "記事のタイトル、著者、ステータス、タグを更新します",
		request: {
			params: slugParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateArticleMetadataSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: ArticleListItemSchema,
					},
				},
				description: "メタデータの更新に成功",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "記事が見つからない",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(updateArticleMetadataRoute, async (c) => {
		try {
			const { slug } = c.req.valid("param");
			const input = c.req.valid("json");

			const article = await useCases.updateArticleMetadataUseCase.execute(
				slug,
				input,
			);

			if (!article) {
				return c.json({ error: "Article not found" }, 404);
			}

			return c.json(ArticleDTO.toListItem(article), 200);
		} catch (error) {
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	// ルート定義: コンテンツ更新
	const updateArticleContentRoute = createRoute({
		method: "put",
		path: "/{slug}/content",
		tags: ["Articles"],
		summary: "記事のコンテンツを更新",
		description: "記事の本文（Markdown）を更新します",
		request: {
			params: slugParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateArticleContentSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: ArticleListItemSchema,
					},
				},
				description: "コンテンツの更新に成功",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "記事が見つからない",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(updateArticleContentRoute, async (c) => {
		try {
			const { slug } = c.req.valid("param");
			const input = c.req.valid("json");

			const article = await useCases.updateArticleContentUseCase.execute(
				slug,
				input,
			);

			if (!article) {
				return c.json({ error: "Article not found" }, 404);
			}

			return c.json(ArticleDTO.toListItem(article), 200);
		} catch (error) {
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	// ルート定義: 記事削除
	const deleteArticleRoute = createRoute({
		method: "delete",
		path: "/{slug}",
		tags: ["Articles"],
		summary: "記事を削除",
		description: "指定されたスラッグの記事を削除します",
		request: {
			params: slugParamSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: DeleteSuccessSchema,
					},
				},
				description: "記事の削除に成功",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "記事が見つからない",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
				description: "サーバーエラー",
			},
		},
	});

	app.openapi(deleteArticleRoute, async (c) => {
		try {
			const { slug } = c.req.valid("param");
			const deleted = await useCases.deleteArticleUseCase.execute(slug);

			if (!deleted) {
				return c.json({ error: "Article not found" }, 404);
			}

			return c.json({ message: "Article deleted successfully" }, 200);
		} catch (error) {
			return c.json(
				{ error: error instanceof Error ? error.message : "Unknown error" },
				500,
			);
		}
	});

	return app;
}
