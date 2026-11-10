/**
 * postコマンド - 記事の投稿
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiClient } from "../lib/api/client.js";
import { processImage } from "../lib/image/processor.js";
import { loadImageAsDataUrl, renderThumbnail } from "../lib/image/thumbnail.js";
import { uploadThumbnail } from "../lib/image/uploader.js";
import { parseMarkdown } from "../lib/markdown/parser.js";
import { logger } from "../lib/utils/logger.js";

const SOURCE = "kanaru.me";
// 生成する OGP 画像（1200x630）を縮小しない
const THUMBNAIL_MAX_SIZE = 1200;

export interface PostCommandOptions {
	title?: string;
	tags?: string;
}

/**
 * 記事を投稿
 */
export async function postCommand(
	filePath: string,
	apiClient: ApiClient,
	options: PostCommandOptions,
) {
	try {
		// ファイルを読み込み
		const fileContent = await readFile(filePath, "utf-8");

		// frontmatterをパース
		const parsed = parseMarkdown(fileContent);

		// メタデータの決定（frontmatter > オプション）
		const title = parsed.frontmatter.title || options.title;
		if (!title) {
			logger.error(
				"タイトルが指定されていません。frontmatterまたは--titleオプションでタイトルを指定してください",
			);
			process.exit(1);
		}

		// slugの決定（frontmatter > ファイル名）
		const slug =
			parsed.frontmatter.slug ||
			path.basename(filePath, path.extname(filePath));

		// その他のメタデータ
		const tags =
			parsed.frontmatter.tags ||
			(options.tags ? options.tags.split(",").map((t) => t.trim()) : []);
		if (tags.length === 0) {
			logger.error(
				"タグが指定されていません。frontmatterまたは--tagsオプションでタグを指定してください",
			);
			process.exit(1);
		}
		const status =
			parsed.frontmatter.published === false ? "unpublished" : "published";

		// サムネイルの決定（frontmatter > 生成）
		let thumbnailUrl = parsed.frontmatter.thumbnailUrl;
		if (!thumbnailUrl) {
			logger.info("サムネイルを生成中");
			const { eyecatchImage, eyecatchEmoji } = parsed.frontmatter;
			const png = await renderThumbnail({
				title,
				tags,
				// 画像のパスは Markdown ファイルからの相対パスとして解決する
				eyecatchImage: eyecatchImage
					? await loadImageAsDataUrl(
							path.resolve(path.dirname(filePath), eyecatchImage),
						)
					: undefined,
				eyecatchEmoji,
			});
			const processed = await processImage(png, {
				maxSize: THUMBNAIL_MAX_SIZE,
			});
			thumbnailUrl = await uploadThumbnail(apiClient, processed.buffer);
		}

		logger.info(`記事を投稿中: ${title} (slug: ${slug})`);

		// 記事を投稿（frontmatter付きコンテンツをそのまま送信）
		await apiClient.postArticle(slug, {
			title,
			contentBody: parsed.originalContent,
			source: SOURCE,
			status,
			tags,
			thumbnailUrl,
		});

		logger.success(`記事の投稿に成功しました`);
		logger.info(`  タイトル: ${title}`);
		logger.info(`  Slug: ${slug}`);
		logger.info(`  ステータス: ${status === "published" ? "公開" : "非公開"}`);
		logger.info(`  タグ: ${tags.join(", ")}`);
		logger.info(`  サムネイル: ${thumbnailUrl}`);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`記事の投稿に失敗しました: ${error.message}`);
		}
		process.exit(1);
	}
}
