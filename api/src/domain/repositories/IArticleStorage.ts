export interface IArticleStorage {
  generateContentKey(content: string): string;
  uploadContent(content: string): Promise<string>;
  getContent(key: string): Promise<string | null>;
  deleteContent(key: string): Promise<void>;
}
