import { z } from "@hono/zod-openapi";

/**
 * JWT発行レスポンス
 */
export const JwtResponseSchema = z.object({
  token: z.string().openapi({
    description: "JWT トークン",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
});

/**
 * 認証エラーレスポンス
 */
export const AuthErrorResponseSchema = z.object({
  error: z.string().openapi({
    description: "エラーメッセージ",
    example: "Unauthorized",
  }),
});
