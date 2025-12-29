import { handle } from "hono/aws-lambda";
import { app, setSecretRepository } from "./app";
import { LambdaExtensionSecretRepository } from "./infrastructure/repositories/LambdaExtensionSecretRepository";

// Lambda環境用のSecretRepositoryを作成
const secretRepository = new LambdaExtensionSecretRepository();
setSecretRepository(secretRepository);

export const handler = handle(app);
