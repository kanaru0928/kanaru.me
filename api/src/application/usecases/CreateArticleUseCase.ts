import type {
	Article,
	CreateArticleInput,
} from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class CreateArticleUseCase {
	constructor(
		private repository: IArticleRepository,
		private storage: IArticleStorage,
	) {}

	async execute(input: CreateArticleInput): Promise<Article> {
		// 既存記事の重複チェック
		const existing = await this.repository.findBySlug(input.slug);
		if (existing) {
			throw new Error(`Article with slug "${input.slug}" already exists`);
		}

		// S3にコンテンツをアップロード
		const contentKey = await this.storage.uploadContent(input.contentBody);

		// メタデータをDynamoDBに保存
		const now = new Date().toISOString();
		const article: Article = {
			slug: input.slug,
			title: input.title,
			content: contentKey,
			author: input.author,
			status: input.status,
			pv: 0,
			createdAt: now,
			updatedAt: now,
			tags: input.tags,
		};

		await this.repository.create(article);

		return article;
	}
}
