import { z } from "zod";

// 環境変数のスキーマ定義
const envSchema = z.object({
  DYNAMODB_TABLE_NAME: z.string().min(1, "DYNAMODB_TABLE_NAME is required"),
  S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  ALLOWED_ORIGINS: z
    .string()
    .min(1, "ALLOWED_ORIGINS is required")
    .transform((val) => val.split(",")),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.coerce.number().default(86400),
  INITIAL_BEARER_TOKEN: z.string().min(1, "INITIAL_BEARER_TOKEN is required"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * 環境変数をバリデーションして返す
 * @throws {Error} 環境変数が不正な場合
 */
export function validateEnv(env: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}
