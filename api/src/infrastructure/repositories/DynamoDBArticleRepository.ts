import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  Article,
  UpdateArticleMetadataInput,
} from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class DynamoDBArticleRepository implements IArticleRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string, region = "ap-northeast-1") {
    const client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async create(article: Article): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: article,
      }),
    );
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { slug },
      }),
    );

    return result.Item ? (result.Item as Article) : null;
  }

  async findAll(): Promise<Article[]> {
    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items || []) as Article[];
  }

  async updateMetadata(
    slug: string,
    input: UpdateArticleMetadataInput,
  ): Promise<Article | null> {
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    // 更新対象のフィールドを動的に構築
    if (input.title !== undefined) {
      updateExpressionParts.push("#title = :title");
      expressionAttributeNames["#title"] = "title";
      expressionAttributeValues[":title"] = input.title;
    }

    if (input.author !== undefined) {
      updateExpressionParts.push("#author = :author");
      expressionAttributeNames["#author"] = "author";
      expressionAttributeValues[":author"] = input.author;
    }

    if (input.status !== undefined) {
      updateExpressionParts.push("#status = :status");
      expressionAttributeNames["#status"] = "status";
      expressionAttributeValues[":status"] = input.status;
    }

    if (input.tags !== undefined) {
      updateExpressionParts.push("#tags = :tags");
      expressionAttributeNames["#tags"] = "tags";
      expressionAttributeValues[":tags"] = input.tags;
    }

    // updatedAtは必ず更新
    updateExpressionParts.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    if (updateExpressionParts.length === 1) {
      // updatedAtのみの場合は更新しない
      return this.findBySlug(slug);
    }

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { slug },
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    return result.Attributes ? (result.Attributes as Article) : null;
  }

  async updateContentKey(
    slug: string,
    newContentKey: string,
  ): Promise<Article | null> {
    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { slug },
        UpdateExpression: "SET #content = :content, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#content": "content",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":content": newContentKey,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      }),
    );

    return result.Attributes ? (result.Attributes as Article) : null;
  }

	async incrementPV(slug: string): Promise<void> {
		await this.docClient.send(
			new UpdateCommand({
				TableName: this.tableName,
				Key: { slug },
				UpdateExpression: "ADD pv :inc",
				ExpressionAttributeValues: {
					":inc": 1,
				},
			}),
		);
	}

  async delete(slug: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { slug },
      }),
    );
  }
}
