import { handle } from "hono/aws-lambda";
import { app, setSecretRepository } from "./app";
import { SSMSecretRepository } from "./infrastructure/repositories/SSMSecretRepository";

// Lambda環境用のSecretRepositoryを作成
const secretRepository = new SSMSecretRepository(
  process.env.AWS_REGION || "ap-northeast-1",
);
setSecretRepository(secretRepository);

export const handler = handle(app);
