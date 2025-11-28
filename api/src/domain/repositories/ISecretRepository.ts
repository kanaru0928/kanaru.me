export interface ISecretRepository {
  getSecretValue(secretName: string): Promise<string | null>;
}
