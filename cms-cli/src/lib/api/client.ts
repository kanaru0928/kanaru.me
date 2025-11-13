/**
 * HTTP APIクライアント
 */
import createClient from "openapi-fetch";
import type { paths } from "../../api/api.js";
import type { AuthManager } from "./auth.js";

export interface ApiClientOptions {
	baseUrl: string;
	authManager: AuthManager;
}

/**
 * APIクライアントを作成
 */
export function createApiClient(options: ApiClientOptions) {
	const client = createClient<paths>({
		baseUrl: options.baseUrl,
	});

	// JWT認証ヘッダーを自動付与するラッパー
	return {
		async getArticles() {
			const token = await options.authManager.getToken();

			const response = await client.GET("/api/articles", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.error) {
				throw new Error(
					`記事一覧取得に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},

		async getArticle(slug: string) {
			const response = await client.GET("/api/articles/{slug}", {
				params: {
					path: { slug },
				},
			});

			if (response.error) {
				throw new Error(
					`記事詳細取得に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},

		async postArticle(body: {
			slug: string;
			title: string;
			contentBody: string;
			author: string;
			status: "published" | "unpublished";
			tags: string[];
		}) {
			const token = await options.authManager.getToken();

			const response = await client.POST("/api/articles", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body,
			});

			if (response.error) {
				throw new Error(
					`記事投稿に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},
	};
}

export type ApiClient = ReturnType<typeof createApiClient>;
