import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { sign } from "hono/jwt";
import type { Env } from "../../app";
import { AuthErrorResponseSchema, JwtResponseSchema } from "../schemas/auth";

/**
 * 認証ルーターを作成
 */
export function createAuthRouter() {
  const router = new OpenAPIHono<Env>();

  // POST /verify - JWT発行エンドポイント
  const verifyRoute = createRoute({
    method: "post",
    path: "/verify",
    tags: ["Auth"],
    summary: "JWT トークンを発行",
    description:
      "初期Bearer トークンを検証し、成功時にJWT トークンを発行します",
    security: [
      {
        InitialBearer: [],
      },
    ],
    responses: {
      200: {
        description: "JWT トークンの発行に成功",
        content: {
          "application/json": {
            schema: JwtResponseSchema,
          },
        },
      },
      401: {
        description: "認証失敗",
        content: {
          "application/json": {
            schema: AuthErrorResponseSchema,
          },
        },
      },
    },
  });

  router.openapi(verifyRoute, async (c) => {
    const env = c.get("env");

    // Authorization ヘッダーから Bearer トークンを取得
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Authorization header is required" }, 401);
    }
    if (!authHeader.startsWith("Bearer ")) {
      return c.json(
        { error: "Invalid authorization format. Expected 'Bearer <token>'" },
        401,
      );
    }

    const token = authHeader.substring(7); // "Bearer " を除去

    // 初期トークンの検証
    if (token !== env.INITIAL_BEARER_TOKEN) {
      return c.json({ error: "Invalid bearer token" }, 401);
    }

    // JWT トークンを発行
    const payload = {
      sub: "api-user",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + env.JWT_EXPIRES_IN,
    };

    const jwt = await sign(payload, env.JWT_SECRET);

    return c.json(
      {
        token: jwt,
      },
      200,
    );
  });

  return router;
}
