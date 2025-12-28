import { handle } from "hono/aws-lambda";
import { app, setSecretRepository } from "./app";
import { SsmSecretRepository } from "./infrastructure/repositories/SsmSecretRepository";

// Lambda環境用のSecretRepositoryを作成
const secretRepository = new SsmSecretRepository();
setSecretRepository(secretRepository);

export const handler = handle(app);
