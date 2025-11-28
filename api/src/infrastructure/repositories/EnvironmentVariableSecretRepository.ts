import type { ISecretRepository } from "../../domain/repositories/ISecretRepository";

const secretNameEnvVarMap: Record<string, string> = {
  "jwt-secret": "JWT_SECRET",
  "initial-bearer-token": "INITIAL_BEARER_TOKEN",
};

export class EnvironmentVariableSecretRepository implements ISecretRepository {
  async getSecretValue(secretName: string): Promise<string | null> {
    const envVarName = secretNameEnvVarMap[secretName];
    if (!envVarName) {
      console.error(`No environment variable mapping found for secret "${secretName}"`);
      return null;
    }

    const secretValue = process.env[envVarName];
    if (!secretValue) {
      console.error(`Environment variable "${envVarName}" is not set`);
      return null;
    }

    return secretValue;
  }
}
