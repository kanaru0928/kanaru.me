import { ValidationError } from "../errors/DomainError";

export interface Article {
  slug: string;
  title: string;
  content: string; // S3 key
  author: string;
  status: "published" | "unpublished";
  pv: number;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  tags: string[];
}

export interface CreateArticleInput {
  slug: string;
  title: string;
  contentBody: string; // 実際のコンテンツ本文
  author: string;
  status: "published" | "unpublished";
  tags: string[];
}

export interface UpdateArticleMetadataInput {
  title?: string;
  author?: string;
  status?: "published" | "unpublished";
  tags?: string[];
}

export interface UpdateArticleContentInput {
  contentBody: string;
}

export interface UpsertArticleInput {
  title: string;
  contentBody: string;
  author: string;
  status: "published" | "unpublished";
  tags: string[];
}

/**
 * 記事のバリデーション制約
 */
export const ArticleConstraints = {
  slug: { min: 1, max: 100 },
  title: { min: 1, max: 200 },
  author: { min: 1, max: 100 },
  contentBody: { min: 1 },
} as const;

/**
 * 記事作成入力をバリデーション
 */
export function validateCreateArticleInput(input: CreateArticleInput) {
  if (
    input.slug.length < ArticleConstraints.slug.min ||
    input.slug.length > ArticleConstraints.slug.max
  ) {
    throw new ValidationError(
      `slug must be between ${ArticleConstraints.slug.min} and ${ArticleConstraints.slug.max} characters`,
    );
  }

  if (
    input.title.length < ArticleConstraints.title.min ||
    input.title.length > ArticleConstraints.title.max
  ) {
    throw new ValidationError(
      `title must be between ${ArticleConstraints.title.min} and ${ArticleConstraints.title.max} characters`,
    );
  }

  if (
    input.author.length < ArticleConstraints.author.min ||
    input.author.length > ArticleConstraints.author.max
  ) {
    throw new ValidationError(
      `author must be between ${ArticleConstraints.author.min} and ${ArticleConstraints.author.max} characters`,
    );
  }

  if (input.contentBody.length < ArticleConstraints.contentBody.min) {
    throw new ValidationError(
      `contentBody must be at least ${ArticleConstraints.contentBody.min} character`,
    );
  }
}

/**
 * 記事メタデータ更新入力をバリデーション
 */
export function validateUpdateArticleMetadataInput(
  input: UpdateArticleMetadataInput,
) {
  if (input.title !== undefined) {
    if (
      input.title.length < ArticleConstraints.title.min ||
      input.title.length > ArticleConstraints.title.max
    ) {
      throw new ValidationError(
        `title must be between ${ArticleConstraints.title.min} and ${ArticleConstraints.title.max} characters`,
      );
    }
  }

  if (input.author !== undefined) {
    if (
      input.author.length < ArticleConstraints.author.min ||
      input.author.length > ArticleConstraints.author.max
    ) {
      throw new ValidationError(
        `author must be between ${ArticleConstraints.author.min} and ${ArticleConstraints.author.max} characters`,
      );
    }
  }
}

/**
 * 記事コンテンツ更新入力をバリデーション
 */
export function validateUpdateArticleContentInput(
  input: UpdateArticleContentInput,
) {
  if (input.contentBody.length < ArticleConstraints.contentBody.min) {
    throw new ValidationError(
      `contentBody must be at least ${ArticleConstraints.contentBody.min} character`,
    );
  }
}
