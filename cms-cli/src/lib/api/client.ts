/**
 * HTTP APIクライアント
 */
import createClient from "openapi-fetch";
import type { components, paths } from "../../api/api.js";
import type { AuthManager } from "./auth.js";

// API が許可する一覧取得件数の上限
const MAX_LIST_LIMIT = 100;

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

	async function authHeaders() {
		const token = await options.authManager.getToken();
		return { "KCMS-Authorization": `Bearer ${token}` };
	}

	// 認証ヘッダーを自動付与するラッパー
	return {
		async getArticles() {
			const response = await client.GET("/api/articles", {
				params: {
					query: { limit: MAX_LIST_LIMIT },
				},
				headers: await authHeaders(),
			});

			if (response.error) {
				throw new Error(
					`記事一覧取得に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},

		async getArticle(slug: string) {
			// 非公開記事も取得するため認証する
			const response = await client.GET("/api/articles/{slug}", {
				params: {
					path: { slug },
				},
				headers: await authHeaders(),
			});

			if (response.error) {
				throw new Error(
					`記事詳細取得に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},

		async postArticle(
			slug: string,
			body: components["schemas"]["UpsertTextArticle"],
		) {
			const response = await client.PUT("/api/articles/{slug}", {
				params: {
					path: { slug },
				},
				headers: await authHeaders(),
				body,
			});

			if (response.error) {
				throw new Error(
					`記事投稿に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},

		async createThumbnailUploadUrl(md5: string) {
			const response = await client.POST("/api/thumbnails/upload-url", {
				headers: await authHeaders(),
				body: { contentType: "image/webp", md5 },
			});

			if (response.error) {
				throw new Error(
					`アップロード URL の発行に失敗しました: ${JSON.stringify(response.error)}`,
				);
			}

			return response.data;
		},
	};
}

export type ApiClient = ReturnType<typeof createApiClient>;
