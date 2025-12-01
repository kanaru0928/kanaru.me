/**
 * listコマンド - 記事一覧の表示
 */
import type { ApiClient } from "../lib/api/client.js";
import { logger } from "../lib/utils/logger.js";

export interface ListCommandOptions {
	page: number;
}

/**
 * 記事一覧を表示
 */
export async function listCommand(
	apiClient: ApiClient,
	options: ListCommandOptions,
) {
	try {
		// 記事一覧を取得
		const articles = await apiClient.getArticles();

		if (!articles || articles.length === 0) {
			logger.info("記事が見つかりませんでした");
			return;
		}

		// ページネーション（10件/ページ）
		const pageSize = 10;
		const totalPages = Math.ceil(articles.length / pageSize);
		const currentPage = options.page;

		if (currentPage < 1 || currentPage > totalPages) {
			logger.error(
				`ページ番号が範囲外です（1-${totalPages}ページまで利用可能）`,
			);
			process.exit(1);
		}

		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const pageArticles = articles.slice(startIndex, endIndex);

		// ヘッダー
		logger.info(`\n記事一覧（ページ ${currentPage}/${totalPages}）\n`);

		// テーブルヘッダー
		console.log(
			"タイトル".padEnd(40) +
				" | " +
				"Slug".padEnd(20) +
				" | " +
				"ステータス".padEnd(10) +
				" | " +
				"更新日".padEnd(20) +
				" | " +
				"タグ",
		);
		console.log("-".repeat(120));

		// 記事情報を表示
		for (const article of pageArticles) {
			const title = article.title.slice(0, 38).padEnd(40);
			const slug = article.slug.slice(0, 18).padEnd(20);
			const status = article.status === "published" ? "公開" : "非公開";
			const statusPadded = status.padEnd(10);
			const updatedAt = new Date(article.updatedAt)
				.toISOString()
				.slice(0, 19)
				.replace("T", " ")
				.padEnd(20);
			const tags = article.tags.join(", ");

			console.log(
				`${title} | ${slug} | ${statusPadded} | ${updatedAt} | ${tags}`,
			);
		}

		// フッター
		console.log(
			`\n合計: ${articles.length}件（${startIndex + 1}-${Math.min(endIndex, articles.length)}件を表示）`,
		);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`記事一覧の取得に失敗しました: ${error.message}`);
		}
		process.exit(1);
	}
}
