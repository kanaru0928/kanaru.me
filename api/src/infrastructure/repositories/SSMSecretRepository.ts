import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import type { ISecretRepository } from "../../domain/repositories/ISecretRepository";

export class SSMSecretRepository implements ISecretRepository {
  private client: SSMClient;

  constructor(region = "ap-northeast-1") {
    this.client = new SSMClient({ region });
  }

  async getSecretValue(secretName: string): Promise<string | null> {
    try {
      const command = new GetParameterCommand({
        Name: secretName,
        WithDecryption: true,
      });
      const response = await this.client.send(command);
      return response.Parameter?.Value || null;
    } catch (error) {
      console.error(`Failed to get secret value for "${secretName}":`, error);
      return null;
    }
  }
}
