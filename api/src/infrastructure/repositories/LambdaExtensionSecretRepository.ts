import type { ISecretRepository } from "../../domain/repositories/ISecretRepository";

export class LambdaExtensionSecretRepository implements ISecretRepository {
  private readonly extensionEndpoint = "http://localhost:2773";
  private readonly timeout = 5000; // 5秒
  private readonly secretNamePrefix: string;

  constructor() {
    this.secretNamePrefix = process.env.SECRET_NAME_PREFIX || "";
  }

  async getSecretValue(secretName: string): Promise<string | null> {
    const sessionToken = process.env.AWS_SESSION_TOKEN;
    if (!sessionToken) {
      console.error("AWS_SESSION_TOKEN environment variable is not set");
      return null;
    }

    const fullSecretName = `${this.secretNamePrefix}${secretName}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${
        this.extensionEndpoint
      }/systemsmanager/parameters/get?name=${encodeURIComponent(
        fullSecretName,
      )}&withDecryption=true`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Aws-Parameters-Secrets-Token": sessionToken,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 200) {
        const data = await response.json();
        return data.Parameter?.Value || null;
      }

      if (response.status === 404) {
        console.error(`Parameter "${fullSecretName}" not found`);
        return null;
      }

      if (response.status === 403) {
        console.error(`Access denied to parameter "${fullSecretName}"`);
        return null;
      }

      console.error(
        `Failed to get secret value for "${fullSecretName}": HTTP ${response.status}`,
      );
      return null;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        console.error(`Request timeout for "${fullSecretName}"`);
      } else {
        console.error(
          `Failed to get secret value for "${fullSecretName}":`,
          error,
        );
      }

      return null;
    }
  }
}
