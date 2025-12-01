import { z } from "zod";
import type { ISecretRepository } from "../domain/repositories/ISecretRepository";

// 環境変数のスキーマ定義
const envSchema = z.object({
  DYNAMODB_TABLE_NAME: z.string().min(1, "DYNAMODB_TABLE_NAME is required"),
  S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),
  S3_ORIGIN_URL: z.string().url("S3_ORIGIN_URL must be a valid URL"),
  S3_KEY_PREFIX: z.string().min(1, "S3_KEY_PREFIX is required"),
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
export async function validateEnv(
  env: Record<string, string | undefined>,
  secretRepository: ISecretRepository,
): Promise<Env> {
  // SecretRepositoryからシークレット取得
  const jwtSecret = await secretRepository.getSecretValue("jwt-secret");
  const initialBearerToken = await secretRepository.getSecretValue(
    "initial-bearer-token",
  );

  if (!jwtSecret) {
    throw new Error("Failed to retrieve JWT_SECRET from SecretRepository");
  }
  if (!initialBearerToken) {
    throw new Error(
      "Failed to retrieve INITIAL_BEARER_TOKEN from SecretRepository",
    );
  }

  // 環境変数とシークレットを統合
  const envWithSecrets = {
    ...env,
    JWT_SECRET: jwtSecret,
    INITIAL_BEARER_TOKEN: initialBearerToken,
  };

  const result = envSchema.safeParse(envWithSecrets);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}
