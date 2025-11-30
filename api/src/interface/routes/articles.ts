import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
// app.tsからEnvをインポート
import type { Env } from "../../app";
import type { DeleteArticleUseCase } from "../../application/usecases/DeleteArticleUseCase";
import type { GetArticleUseCase } from "../../application/usecases/GetArticleUseCase";
import type { ListArticlesUseCase } from "../../application/usecases/ListArticlesUseCase";
import type { UpsertArticleUseCase } from "../../application/usecases/UpsertArticleUseCase";
import { DI_TOKENS } from "../../infrastructure/container/types";
import { toArticleDetail, toArticleListItem } from "../dto/ArticleDTO";
import {
  createAuthMiddleware,
  createOptionalAuthMiddleware,
} from "../middleware/authMiddleware";
import {
  ArticleDetailSchema,
  ArticleListItemSchema,
  DeleteSuccessSchema,
  ErrorSchema,
} from "../schemas/articleSchemas";
import {
  listArticlesQuerySchema,
  slugParamSchema,
  upsertArticleSchema,
} from "../validators/articleValidator";

export function createArticleRouter() {
  const app = new OpenAPIHono<Env>();

  // ルート定義: 記事一覧取得
  const listArticlesRoute = createRoute({
    method: "get",
    path: "/",
    tags: ["Articles"],
    summary: "記事一覧を取得",
    description:
      "記事の一覧を取得します。認証されていない場合は公開済み記事のみ返却されます。",
    request: {
      query: listArticlesQuerySchema,
    },
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

  app.on(["GET"], "/", createOptionalAuthMiddleware());
  app.openapi(listArticlesRoute, async (c) => {
    const container = c.get("container");
    const listArticlesUseCase = container.resolve<ListArticlesUseCase>(
      DI_TOKENS.ListArticlesUseCase,
    );

    // クエリパラメータを取得
    const query = c.req.valid("query");

    // 認証状態を確認
    const isAuthenticated = c.get("jwtPayload") !== undefined;

    // タグフィルタの配列変換
    const tags = query.tag ? [query.tag] : undefined;

    const articles = await listArticlesUseCase.execute({
      isAuthenticated,
      tags,
      sortBy: query.sortBy,
      order: query.order,
    });

    return c.json(
      articles.map((a) => toArticleListItem(a)),
      200,
    );
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
    const container = c.get("container");
    const getArticleUseCase = container.resolve<GetArticleUseCase>(
      DI_TOKENS.GetArticleUseCase,
    );

    const { slug } = c.req.valid("param");
    const article = await getArticleUseCase.execute(slug);

    if (!article) {
      return c.json({ error: "Article not found" }, 404);
    }

    return c.json(toArticleDetail(article), 200);
  });

  // ルート定義: 記事削除
  const deleteArticleRoute = createRoute({
    method: "delete",
    path: "/{slug}",
    tags: ["Articles"],
    summary: "記事を削除",
    description: "指定されたスラッグの記事を削除します（要認証）",
    security: [{ Bearer: [] }],
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
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "認証失敗",
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

  app.on(["DELETE"], "/:slug", createAuthMiddleware());
  app.openapi(deleteArticleRoute, async (c) => {
    const container = c.get("container");
    const deleteArticleUseCase = container.resolve<DeleteArticleUseCase>(
      DI_TOKENS.DeleteArticleUseCase,
    );

    const { slug } = c.req.valid("param");
    await deleteArticleUseCase.execute(slug);

    return c.json({ message: "Article deleted successfully" }, 200);
  });

  // ルート定義: 記事のupsert
  const upsertArticleRoute = createRoute({
    method: "put",
    path: "/{slug}",
    tags: ["Articles"],
    summary: "記事を作成または更新",
    description:
      "記事が存在しない場合は新規作成、存在する場合は全体を更新します（要認証）",
    security: [{ Bearer: [] }],
    request: {
      params: slugParamSchema,
      body: {
        content: {
          "application/json": {
            schema: upsertArticleSchema,
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
        description: "記事の更新に成功",
      },
      201: {
        content: {
          "application/json": {
            schema: ArticleListItemSchema,
          },
        },
        description: "記事の作成に成功",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "認証失敗",
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

  app.on(["PUT"], "/:slug", createAuthMiddleware());
  app.openapi(upsertArticleRoute, async (c) => {
    const container = c.get("container");
    const upsertArticleUseCase = container.resolve<UpsertArticleUseCase>(
      DI_TOKENS.UpsertArticleUseCase,
    );

    const { slug } = c.req.valid("param");
    const input = c.req.valid("json");

    const { article, isNew } = await upsertArticleUseCase.execute(slug, input);

    return c.json(toArticleListItem(article), isNew ? 201 : 200);
  });

  return app;
}
