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
