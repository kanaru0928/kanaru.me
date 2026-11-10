/**
 * Markdownファイルのfrontmatterパース
 */
import matter from "gray-matter";

export interface FrontmatterData {
	title?: string;
	description?: string;
	tags?: string[];
	published?: boolean;
	slug?: string;
	thumbnailUrl?: string;
	/** サムネイルのアイキャッチ画像（Markdown ファイルからの相対パス） */
	eyecatchImage?: string;
	/** サムネイルのアイキャッチ絵文字（eyecatchImage があればそちらを優先） */
	eyecatchEmoji?: string;
}

export interface ParsedMarkdown {
	frontmatter: FrontmatterData;
	content: string;
	originalContent: string;
}

/**
 * Markdownファイルをパース
 */
export function parseMarkdown(fileContent: string): ParsedMarkdown {
	const { data, content } = matter(fileContent);

	return {
		frontmatter: {
			title: data.title,
			description: data.description,
			tags: Array.isArray(data.tags) ? data.tags : undefined,
			published: data.published,
			slug: data.slug,
			thumbnailUrl: data.thumbnailUrl,
			eyecatchImage: data.eyecatchImage,
			eyecatchEmoji: data.eyecatchEmoji,
		},
		content,
		originalContent: fileContent,
	};
}
