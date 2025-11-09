import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateArticleUseCase } from "../../application/usecases/CreateArticleUseCase";
import { DeleteArticleUseCase } from "../../application/usecases/DeleteArticleUseCase";
import { GetArticleUseCase } from "../../application/usecases/GetArticleUseCase";
import { ListArticlesUseCase } from "../../application/usecases/ListArticlesUseCase";
import { UpdateArticleContentUseCase } from "../../application/usecases/UpdateArticleContentUseCase";
import { UpdateArticleMetadataUseCase } from "../../application/usecases/UpdateArticleMetadataUseCase";
import { DynamoDBArticleRepository } from "../../infrastructure/repositories/DynamoDBArticleRepository";
import { S3ArticleStorage } from "../../infrastructure/storage/S3ArticleStorage";
import { toArticleDetail, toArticleListItem } from "../dto/ArticleDTO";
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

// 環境変数の型定義
type Env = {
  Bindings: {
    DYNAMODB_TABLE_NAME: string;
    S3_BUCKET_NAME: string;
    AWS_REGION: string;
  };
};

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
    try {
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const listArticlesUseCase = new ListArticlesUseCase(repository);

      const articles = await listArticlesUseCase.execute();
      return c.json(
        articles.map((a) => toArticleListItem(a)),
        200,
      );
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
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const storage = new S3ArticleStorage(
        c.env.S3_BUCKET_NAME,
        c.env.AWS_REGION,
      );
      const createArticleUseCase = new CreateArticleUseCase(
        repository,
        storage,
      );

      const input = c.req.valid("json");
      const article = await createArticleUseCase.execute(input);
      return c.json(toArticleListItem(article), 201);
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
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const storage = new S3ArticleStorage(
        c.env.S3_BUCKET_NAME,
        c.env.AWS_REGION,
      );
      const getArticleUseCase = new GetArticleUseCase(repository, storage);

      const { slug } = c.req.valid("param");
      const article = await getArticleUseCase.execute(slug);

      if (!article) {
        return c.json({ error: "Article not found" }, 404);
      }

      return c.json(toArticleDetail(article), 200);
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
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const updateArticleMetadataUseCase = new UpdateArticleMetadataUseCase(
        repository,
      );

      const { slug } = c.req.valid("param");
      const input = c.req.valid("json");

      const article = await updateArticleMetadataUseCase.execute(slug, input);

      if (!article) {
        return c.json({ error: "Article not found" }, 404);
      }

      return c.json(toArticleListItem(article), 200);
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
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const storage = new S3ArticleStorage(
        c.env.S3_BUCKET_NAME,
        c.env.AWS_REGION,
      );
      const updateArticleContentUseCase = new UpdateArticleContentUseCase(
        repository,
        storage,
      );

      const { slug } = c.req.valid("param");
      const input = c.req.valid("json");

      const article = await updateArticleContentUseCase.execute(slug, input);

      if (!article) {
        return c.json({ error: "Article not found" }, 404);
      }

      return c.json(toArticleListItem(article), 200);
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
      // 環境変数から設定を取得
      const repository = new DynamoDBArticleRepository(
        c.env.DYNAMODB_TABLE_NAME,
        c.env.AWS_REGION,
      );
      const storage = new S3ArticleStorage(
        c.env.S3_BUCKET_NAME,
        c.env.AWS_REGION,
      );
      const deleteArticleUseCase = new DeleteArticleUseCase(
        repository,
        storage,
      );

      const { slug } = c.req.valid("param");
      const deleted = await deleteArticleUseCase.execute(slug);

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
