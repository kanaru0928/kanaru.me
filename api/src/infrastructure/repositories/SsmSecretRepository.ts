import {
  GetParameterCommand,
  type GetParameterCommandInput,
  ParameterNotFound,
  SSMClient,
} from "@aws-sdk/client-ssm";
import type { ISecretRepository } from "../../domain/repositories/ISecretRepository";

const ssmClient = new SSMClient({});

export class SsmSecretRepository implements ISecretRepository {
  private readonly timeout = 5000; // 5秒
  private readonly secretNamePrefix: string;

  constructor() {
    this.secretNamePrefix = process.env.SECRET_NAME_PREFIX || "";
  }

  async getSecretValue(secretName: string): Promise<string | null> {
    const fullSecretName = `${this.secretNamePrefix}${secretName}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const input: GetParameterCommandInput = {
        Name: fullSecretName,
        WithDecryption: true,
      };

      const command = new GetParameterCommand(input);
      const response = await ssmClient.send(command, {
        abortSignal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.Parameter?.Value || null;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ParameterNotFound) {
        console.error(`Parameter "${fullSecretName}" not found`);
        return null;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error(`Request timeout for "${fullSecretName}"`);
        } else if (error.name === "AccessDeniedException") {
          console.error(`Access denied to parameter "${fullSecretName}"`);
        } else {
          console.error(
            `Failed to get secret value for "${fullSecretName}":`,
            error,
          );
        }
      }

      return null;
    }
  }
}
