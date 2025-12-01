import type { ISecretRepository } from "../../src/domain/repositories/ISecretRepository";

/**
 * テスト用のモックSecretRepository
 */
export function createMockSecretRepository(
  secrets: Record<string, string> = {},
): ISecretRepository {
  return {
    async getSecretValue(secretName: string): Promise<string | null> {
      return secrets[secretName] || null;
    },
  };
}
