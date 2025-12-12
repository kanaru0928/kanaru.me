import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { Env } from "../../app";
import type { GenerateOgImageUseCase } from "../../application/usecases/GenerateOgImageUseCase";
import { DI_TOKENS } from "../../infrastructure/container/types";
import { ErrorSchema } from "../schemas/articleSchemas";
import { slugParamSchema } from "../validators/articleValidator";

export function createOgRouter() {
  const app = new OpenAPIHono<Env>();

  // ルート定義: OGP画像生成
  const getOgImageRoute = createRoute({
    method: "get",
    path: "/articles/{slug}",
    tags: ["OGP"],
    summary: "記事のOGP画像を生成",
    description: "指定された記事のタイトルを描画したOGP画像（PNG）を返します",
    request: {
      params: slugParamSchema,
    },
    responses: {
      200: {
        content: {
          "image/png": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
        description: "OGP画像の生成に成功",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "記事が見つかりません",
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

  app.openapi(getOgImageRoute, async (c) => {
    const { slug } = c.req.valid("param");
    const container = c.get("container");
    const useCase = container.resolve<GenerateOgImageUseCase>(
      DI_TOKENS.GenerateOgImageUseCase,
    );

    const buffer = await useCase.execute(slug);

    return c.body(new Uint8Array(buffer), 200, {
      "Content-Type": "image/png",
    });
  });

  return app;
}
