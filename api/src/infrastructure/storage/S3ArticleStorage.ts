import { createHash } from "node:crypto";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class S3ArticleStorage implements IArticleStorage {
  private client: S3Client;
  private bucketName: string;
  private originUrl: string;
  private keyPrefix: string;

  constructor(
    bucketName: string,
    originUrl: string,
    keyPrefix: string,
    region = "ap-northeast-1",
  ) {
    this.client = new S3Client({ region });
    this.bucketName = bucketName;
    this.originUrl = originUrl;
    this.keyPrefix = keyPrefix;
  }

  /**
   * コンテンツからSHA-256ハッシュを生成してS3キーを作成
   */
  private generateContentKey(content: string): string {
    const hash = createHash("sha256")
      .update(content, "utf-8")
      .digest("base64url");
    return `static/articles/${hash}.mdx`;
  }

  /**
   * S3にコンテンツをアップロード
   */
  async uploadContent(content: string): Promise<string> {
    const key = this.generateContentKey(content);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${this.keyPrefix}${key}`,
        Body: content,
        ContentType: "text/markdown; charset=utf-8",
      }),
    );

    return key;
  }

  /**
   * S3からコンテンツを取得
   */
  async getContent(key: string): Promise<string | null> {
    try {
      const url = `${this.originUrl}/${this.keyPrefix}${key}`
      console.log("Fetching content from URL:", url);
      const response = await fetch(url);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch content from S3: ${response.statusText}`,
        );
      }

      return await response.text();
    } catch (error) {
      if (
        error instanceof Error &&
        "name" in error &&
        error.name === "NoSuchKey"
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * S3からコンテンツを削除
   */
  async deleteContent(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: `${this.keyPrefix}${key}`,
      }),
    );
  }
}
