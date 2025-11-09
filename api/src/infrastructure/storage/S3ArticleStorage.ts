import { createHash } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class S3ArticleStorage implements IArticleStorage {
  private client: S3Client;
  private bucketName: string;

  constructor(bucketName: string, region = "ap-northeast-1") {
    this.client = new S3Client({ region });
    this.bucketName = bucketName;
  }

  /**
   * コンテンツからSHA-256ハッシュを生成してS3キーを作成
   */
  generateContentKey(content: string): string {
    const hash = createHash("sha256").update(content, "utf-8").digest("hex");
    return `articles/${hash}.md`;
  }

  /**
   * S3にコンテンツをアップロード
   */
  async uploadContent(content: string): Promise<string> {
    const key = this.generateContentKey(content);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
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
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      if (!response.Body) {
        return null;
      }

      return await response.Body.transformToString("utf-8");
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
        Key: key,
      }),
    );
  }
}
