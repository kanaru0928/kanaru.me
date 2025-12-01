/**
 * postコマンド - 記事の投稿
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiClient } from "../lib/api/client.js";
import { parseMarkdown } from "../lib/markdown/parser.js";
import { logger } from "../lib/utils/logger.js";

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
		const status =
			parsed.frontmatter.published === false ? "unpublished" : "published";
		const author = parsed.frontmatter.author || "cms-cli";

		logger.info(`記事を投稿中: ${title} (slug: ${slug})`);

		// 記事を投稿（frontmatter付きコンテンツをそのまま送信）
		await apiClient.postArticle({
			slug,
			title,
			contentBody: parsed.originalContent,
			author,
			status,
			tags,
		});

		logger.success(`記事の投稿に成功しました`);
		logger.info(`  タイトル: ${title}`);
		logger.info(`  Slug: ${slug}`);
		logger.info(`  ステータス: ${status === "published" ? "公開" : "非公開"}`);
		logger.info(`  タグ: ${tags.join(", ") || "なし"}`);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`記事の投稿に失敗しました: ${error.message}`);
		}
		process.exit(1);
	}
}
