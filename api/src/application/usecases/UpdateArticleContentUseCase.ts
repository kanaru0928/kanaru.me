import type {
	Article,
	UpdateArticleContentInput,
} from "../../domain/entities/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import type { IArticleStorage } from "../../domain/repositories/IArticleStorage";

export class UpdateArticleContentUseCase {
	constructor(
		private repository: IArticleRepository,
		private storage: IArticleStorage,
	) {}

	async execute(
		slug: string,
		input: UpdateArticleContentInput,
	): Promise<Article | null> {
		// 記事の存在確認
		const existing = await this.repository.findBySlug(slug);
		if (!existing) {
			return null;
		}

		// 新しいコンテンツをS3にアップロード
		const newContentKey = await this.storage.uploadContent(input.contentBody);

		// メタデータのcontentキーを更新
		return this.repository.updateContentKey(slug, newContentKey);
	}
}
