/**
 * 旧 cms（DynamoDB + S3）の記事を新 cms の DynamoDB と S3 へ直接移行する使い捨てスクリプト
 *
 * 作成日時・更新日時・PV を引き継ぐため、API を経由せずに書き込む。
 * 書き込み形式は cms/internal/metadata/dynamodb.go の PutArticle と cms/internal/content/s3.go に揃えている。
 *
 * 使い方: node scripts/migrate-old-cms.ts [--dry-run]
 */
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";
import {
	DynamoDBDocumentClient,
	GetCommand,
	paginateScan,
	TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { processImage } from "../src/lib/image/processor.ts";
import { renderThumbnail } from "../src/lib/image/thumbnail.ts";

// 旧 API の S3_KEY_PREFIX
const OLD_CONTENT_PREFIX = "static/articles/";
// 新 cms の S3_PREFIX（infrastructure の CMS_CONTENT_PREFIX）
const NEW_CONTENT_PREFIX = "contents/";
// cms/internal/thumbnail/service.go の keyPrefix
const THUMBNAIL_PREFIX = "thumbnails/";
// cms/internal/content/s3.go と揃える
const CONTENT_CACHE_CONTROL = "public, max-age=0, s-maxage=3600";
const CONTENT_TYPE = "text/markdown; charset=utf-8";

const SOURCE = "kanaru.me";
// 生成する OGP 画像（1200x630）を縮小しない
const THUMBNAIL_MAX_SIZE = 1200;

// cms/internal/metadata/domain.go の制約。Go の len() に合わせてバイト数で数える
const TITLE_MAX_BYTES = 200;
const TAGS_MAX_COUNT = 20;
const TAG_MAX_BYTES = 50;

interface OldArticle {
	slug: string;
	title: string;
	content: string; // S3 キー
	author: string;
	status: "published" | "unpublished";
	pv: number;
	createdAt: string;
	updatedAt: string;
	tags?: string[];
}

type MigrationResult = "migrated" | "skipped" | "failed";

const { values: args } = parseArgs({
	options: { "dry-run": { type: "boolean", default: false } },
});
const dryRun = args["dry-run"];

const env = {
	oldTableName: requireEnv("OLD_TABLE_NAME"),
	oldBucketName: requireEnv("OLD_BUCKET_NAME"),
	newTableName: requireEnv("NEW_TABLE_NAME"),
	newBucketName: requireEnv("NEW_BUCKET_NAME"),
	thumbnailBucketName: requireEnv("THUMBNAIL_BUCKET_NAME"),
};

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3Client = new S3Client({});

const counts: Record<MigrationResult, number> = {
	migrated: 0,
	skipped: 0,
	failed: 0,
};

if (dryRun) {
	console.log("dry-run: 書き込みとサムネイル生成は行いません\n");
}

for await (const page of paginateScan(
	{ client: docClient },
	{ TableName: env.oldTableName },
)) {
	for (const item of page.Items ?? []) {
		const article = item as OldArticle;
		const result = await migrateArticle(article).catch((error: unknown) => {
			console.error(
				`✗ Failed: ${article.slug} (${error instanceof Error ? error.message : String(error)})`,
			);
			return "failed" as const;
		});
		counts[result]++;
	}
}

console.log("\nSummary:");
console.log(`  Migrated: ${counts.migrated}`);
console.log(`  Skipped: ${counts.skipped}`);
console.log(`  Failed: ${counts.failed}`);

if (counts.failed > 0) {
	process.exit(1);
}

async function migrateArticle(article: OldArticle): Promise<MigrationResult> {
	const { slug } = article;

	if (await existsInNewTable(slug)) {
		console.log(`- Skipped: ${slug} (新 cms に存在します)`);
		return "skipped";
	}

	const tags = article.tags ?? [];
	validateArticle(article, tags);

	const createdAt = toRFC3339(article.createdAt);
	const updatedAt = toRFC3339(article.updatedAt);
	const contentBody = await getOldContent(article.content);
	const contentKey = `articles/${slug}/${md5Hex(contentBody)}.md`;

	if (dryRun) {
		console.log(`✓ Would migrate: ${slug}`);
		console.log(`    title: ${article.title}`);
		console.log(`    status: ${article.status}, pv: ${article.pv}`);
		console.log(`    tags: ${tags.join(", ")}`);
		console.log(`    createdAt: ${createdAt}, updatedAt: ${updatedAt}`);
		console.log(`    contentKey: ${contentKey}`);
		return "migrated";
	}

	const thumbnailUrl = await uploadThumbnail(article.title, tags);
	await putContent(contentKey, contentBody);
	await putMetadata({
		slug,
		title: article.title,
		status: article.status,
		pv: article.pv ?? 0,
		tags,
		contentKey,
		createdAt,
		updatedAt,
		thumbnailUrl,
	});

	console.log(`✓ Migrated: ${slug}`);
	return "migrated";
}

/**
 * 新 cms が受け付けない記事を書き込み前に弾く
 */
function validateArticle(article: OldArticle, tags: string[]) {
	const titleBytes = Buffer.byteLength(article.title ?? "");
	if (titleBytes < 1 || titleBytes > TITLE_MAX_BYTES) {
		throw new Error(`title は 1〜${TITLE_MAX_BYTES} バイトにしてください`);
	}

	if (article.status !== "published" && article.status !== "unpublished") {
		throw new Error(`status が不正です: ${article.status}`);
	}

	if (tags.length < 1 || tags.length > TAGS_MAX_COUNT) {
		throw new Error(`tags は 1〜${TAGS_MAX_COUNT} 件にしてください`);
	}
	for (const tag of tags) {
		const tagBytes = Buffer.byteLength(tag);
		if (tagBytes < 1 || tagBytes > TAG_MAX_BYTES) {
			throw new Error(
				`tag は 1〜${TAG_MAX_BYTES} バイトにしてください: ${tag}`,
			);
		}
	}
	// DynamoDB の文字列セットは重複を持てないため、重複したタグは件数が変わる
	if (new Set(tags).size !== tags.length) {
		throw new Error(`tags に重複があります: ${tags.join(", ")}`);
	}
}

async function existsInNewTable(slug: string): Promise<boolean> {
	const result = await docClient.send(
		new GetCommand({
			TableName: env.newTableName,
			Key: { slug, item_type: "ARTICLE" },
			ProjectionExpression: "slug",
		}),
	);
	return result.Item !== undefined;
}

async function getOldContent(key: string): Promise<string> {
	const result = await s3Client.send(
		new GetObjectCommand({
			Bucket: env.oldBucketName,
			Key: `${OLD_CONTENT_PREFIX}${key}`,
		}),
	);
	const body = await result.Body?.transformToString("utf-8");
	if (!body) {
		throw new Error(`本文が空です: ${key}`);
	}
	return body;
}

async function uploadThumbnail(title: string, tags: string[]): Promise<string> {
	const png = await renderThumbnail({ title, tags });
	const { buffer } = await processImage(png, { maxSize: THUMBNAIL_MAX_SIZE });
	const key = `${THUMBNAIL_PREFIX}${md5Hex(buffer)}.webp`;

	await s3Client.send(
		new PutObjectCommand({
			Bucket: env.thumbnailBucketName,
			Key: key,
			Body: buffer,
			ContentType: "image/webp",
		}),
	);

	return `/${key}`;
}

async function putContent(key: string, body: string) {
	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: env.newBucketName,
				Key: `${NEW_CONTENT_PREFIX}${key}`,
				Body: body,
				CacheControl: CONTENT_CACHE_CONTROL,
				ContentType: CONTENT_TYPE,
				// 本文は immutable なため、既存のキーは上書きしない
				IfNoneMatch: "*",
			}),
		);
	} catch (error) {
		// キーは本文のハッシュから決まるため、既に存在する場合は同じ本文が保存されている
		if (
			error instanceof S3ServiceException &&
			error.name === "PreconditionFailed"
		) {
			return;
		}
		throw error;
	}
}

interface NewArticle {
	slug: string;
	title: string;
	status: "published" | "unpublished";
	pv: number;
	tags: string[];
	contentKey: string;
	createdAt: string;
	updatedAt: string;
	thumbnailUrl: string;
}

/**
 * ARTICLE アイテムと TAG#<tag> アイテムを 1 トランザクションで書き込む
 */
async function putMetadata(article: NewArticle) {
	const common = {
		slug: article.slug,
		status: article.status,
		title: article.title,
		source: SOURCE,
		content_key: article.contentKey,
		// Go 実装と同じく文字列セット（SS）として保存する
		tags: new Set(article.tags),
		updated_at: article.updatedAt,
		created_at: article.createdAt,
	};

	await docClient.send(
		new TransactWriteCommand({
			TransactItems: [
				{
					Put: {
						TableName: env.newTableName,
						Item: {
							...common,
							item_type: "ARTICLE",
							filter_tag: "#ALL",
							pv: article.pv ?? 0,
							thumbnail_url: article.thumbnailUrl,
						},
						// 存在確認の後に作られた記事を上書きしない
						ConditionExpression: "attribute_not_exists(slug)",
					},
				},
				...article.tags.map((tag) => ({
					Put: {
						TableName: env.newTableName,
						Item: {
							...common,
							item_type: `TAG#${tag}`,
							filter_tag: tag,
						},
					},
				})),
			],
		}),
	);
}

/**
 * 旧 cms の toISOString() 形式を、Go の time.RFC3339（秒精度）に揃える
 *
 * GSI は updated_at を文字列順で並べるため、新 cms で作られた記事と形式を揃える
 */
function toRFC3339(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`日時が不正です: ${value}`);
	}
	return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function md5Hex(data: string | Buffer): string {
	return createHash("md5").update(data).digest("hex");
}

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		console.error(`環境変数 ${name} を指定してください`);
		process.exit(1);
	}
	return value;
}
