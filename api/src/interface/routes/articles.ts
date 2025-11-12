import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
// app.tsからEnvをインポート
import type { Env } from "../../app";
import type { CreateArticleUseCase } from "../../application/usecases/CreateArticleUseCase";
import type { DeleteArticleUseCase } from "../../application/usecases/DeleteArticleUseCase";
import type { GetArticleUseCase } from "../../application/usecases/GetArticleUseCase";
import type { ListArticlesUseCase } from "../../application/usecases/ListArticlesUseCase";
import type { UpdateArticleContentUseCase } from "../../application/usecases/UpdateArticleContentUseCase";
import type { UpdateArticleMetadataUseCase } from "../../application/usecases/UpdateArticleMetadataUseCase";
import { DI_TOKENS } from "../../infrastructure/container/types";
import { toArticleDetail, toArticleListItem } from "../dto/ArticleDTO";
import { createAuthMiddleware } from "../middleware/authMiddleware";
import {
  ArticleDetailSchema,
  ArticleListItemSchema,
  DeleteSuccessSchema,
  ErrorSchema,
} from "../schemas/articleSchemas";
import {
  createArticleSchema,
  slugParamSchema,
  updateArticleContentSchema,
  updateArticleMetadataSchema,
} from "../validators/articleValidator";

export function createArticleRouter() {
  const app = new OpenAPIHono<Env>();

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
    const container = c.get("container");
    const listArticlesUseCase = container.resolve<ListArticlesUseCase>(
      DI_TOKENS.ListArticlesUseCase,
    );

    const articles = await listArticlesUseCase.execute();
    return c.json(
      articles.map((a) => toArticleListItem(a)),
      200,
    );
  });

  // ルート定義: 記事作成
  const createArticleRoute = createRoute({
    method: "post",
    path: "/",
    tags: ["Articles"],
    summary: "記事を作成",
    description: "新しい記事を作成します（要認証）",
    security: [{ Bearer: [] }],
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
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "認証失敗",
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

  app.on(["POST"], "/", createAuthMiddleware());
  app.openapi(createArticleRoute, async (c) => {
    const container = c.get("container");
    const createArticleUseCase = container.resolve<CreateArticleUseCase>(
      DI_TOKENS.CreateArticleUseCase,
    );

    const input = c.req.valid("json");
    const article = await createArticleUseCase.execute(input);
    return c.json(toArticleListItem(article), 201);
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

  // ルート定義: メタデータ更新
  const updateArticleMetadataRoute = createRoute({
    method: "patch",
    path: "/{slug}",
    tags: ["Articles"],
    summary: "記事のメタデータを更新",
    description: "記事のタイトル、著者、ステータス、タグを更新します（要認証）",
    security: [{ Bearer: [] }],
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

  app.on(["PATCH"], "/:slug", createAuthMiddleware());
  app.openapi(updateArticleMetadataRoute, async (c) => {
    const container = c.get("container");
    const updateArticleMetadataUseCase =
      container.resolve<UpdateArticleMetadataUseCase>(
        DI_TOKENS.UpdateArticleMetadataUseCase,
      );

    const { slug } = c.req.valid("param");
    const input = c.req.valid("json");

    const article = await updateArticleMetadataUseCase.execute(slug, input);

    return c.json(toArticleListItem(article), 200);
  });

  // ルート定義: コンテンツ更新
  const updateArticleContentRoute = createRoute({
    method: "put",
    path: "/{slug}/content",
    tags: ["Articles"],
    summary: "記事のコンテンツを更新",
    description: "記事の本文（Markdown）を更新します（要認証）",
    security: [{ Bearer: [] }],
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

  app.on(["PUT"], "/:slug/content", createAuthMiddleware());
  app.openapi(updateArticleContentRoute, async (c) => {
    const container = c.get("container");
    const updateArticleContentUseCase =
      container.resolve<UpdateArticleContentUseCase>(
        DI_TOKENS.UpdateArticleContentUseCase,
      );

    const { slug } = c.req.valid("param");
    const input = c.req.valid("json");

    const article = await updateArticleContentUseCase.execute(slug, input);

    return c.json(toArticleListItem(article), 200);
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

  return app;
}
