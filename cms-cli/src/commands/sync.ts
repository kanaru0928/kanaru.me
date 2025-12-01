/**
 * syncコマンド - 記事の同期
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ApiClient } from "../lib/api/client.js";
import { logger } from "../lib/utils/logger.js";

export type SyncCommandOptions = Record<string, never>;

interface SyncResult {
	created: string[];
	updated: string[];
	skipped: string[];
}

/**
 * 記事を同期
 */
export async function syncCommand(
	directory: string,
	apiClient: ApiClient,
	_options: SyncCommandOptions,
) {
	try {
		logger.info(`記事を ${directory} に同期中...\n`);

		// ディレクトリを作成（存在しない場合）
		await mkdir(directory, { recursive: true });

		// 記事一覧を取得
		const articles = await apiClient.getArticles();

		if (!articles || articles.length === 0) {
			logger.info("同期する記事が見つかりませんでした");
			return;
		}

		const result: SyncResult = {
			created: [],
			updated: [],
			skipped: [],
		};

		// 各記事を処理
		for (const article of articles) {
			const fileName = `${article.slug}.md`;
			const filePath = path.join(directory, fileName);

			try {
				// 記事詳細を取得（contentBodyを含む）
				const articleDetail = await apiClient.getArticle(article.slug);
				const content = articleDetail.contentBody;

				// 既存ファイルの確認
				let existingContent: string | null = null;
				try {
					existingContent = await readFile(filePath, "utf-8");
				} catch {
					// ファイルが存在しない場合は新規作成
				}

				if (existingContent === null) {
					// 新規作成
					await writeFile(filePath, content, "utf-8");
					result.created.push(fileName);
					logger.success(`作成: ${fileName}`);
				} else if (existingContent !== content) {
					// 更新
					await writeFile(filePath, content, "utf-8");
					result.updated.push(fileName);
					logger.success(`更新: ${fileName}`);
				} else {
					// スキップ（変更なし）
					result.skipped.push(fileName);
					logger.skip(`スキップ: ${fileName}（変更なし）`);
				}
			} catch (error) {
				if (error instanceof Error) {
					logger.error(`${fileName} の処理に失敗: ${error.message}`);
				}
			}
		}

		// サマリー表示
		logger.info("\nサマリー:");
		logger.info(`  作成: ${result.created.length}`);
		logger.info(`  更新: ${result.updated.length}`);
		logger.info(`  スキップ: ${result.skipped.length}`);
		logger.info(`  合計: ${articles.length}`);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`記事の同期に失敗しました: ${error.message}`);
		}
		process.exit(1);
	}
}
