import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";
import type { Env } from "../../app";

/**
 * JWT認証ミドルウェア
 * KCMS-Authorization: Bearer <token> ヘッダーからJWTを検証
 */
export const createAuthMiddleware = (): MiddlewareHandler<Env> => {
  return async (c, next) => {
    // KCMS-Authorizationヘッダーの明示的なチェック
    const authHeader = c.req.header("KCMS-Authorization");
    if (!authHeader) {
      return c.json({ error: "KCMS-Authorization header is required" }, 401);
    }
    if (!authHeader.startsWith("Bearer ")) {
      return c.json(
        { error: "Invalid authorization format. Expected 'Bearer <token>'" },
        401,
      );
    }

    const env = c.get("env");
    const jwtMiddleware = jwt({
      secret: env.JWT_SECRET,
      headerName: "KCMS-Authorization",
    });

    try {
      return await jwtMiddleware(c, next);
    } catch (error) {
      // JWT検証エラーを統一的に処理
      if (error instanceof Error) {
        if (error.message.includes("expired")) {
          return c.json({ error: "Token has expired" }, 401);
        }
        if (
          error.message.includes("invalid") ||
          error.message.includes("malformed")
        ) {
          return c.json({ error: "Invalid token" }, 401);
        }
      }
      return c.json({ error: "Unauthorized" }, 401);
    }
  };
};

/**
 * オプショナルなJWT認証ミドルウェア
 * KCMS-Authorization: Bearer <token> ヘッダーがあれば検証し、なければスキップ
 */
export const createOptionalAuthMiddleware = (): MiddlewareHandler<Env> => {
  return async (c, next) => {
    const authHeader = c.req.header("KCMS-Authorization");
    // KCMS-Authorizationヘッダーがない場合はスキップ
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return await next();
    }

    const env = c.get("env");
    const jwtMiddleware = jwt({
      secret: env.JWT_SECRET,
      headerName: "KCMS-Authorization",
    });

    try {
      return await jwtMiddleware(c, next);
    } catch (_error) {
      // JWT検証エラーの場合もスキップ（認証なしとして扱う）
      return await next();
    }
  };
};
