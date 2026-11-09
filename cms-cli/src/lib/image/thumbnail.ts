/**
 * 記事タイトル入りの OGP 画像を生成
 */
import puppeteer from "puppeteer";

const WIDTH = 1200;
const HEIGHT = 630;

export interface ThumbnailContent {
	title: string;
	tags: string[];
}

/**
 * HTML テンプレートをスクリーンショットして PNG を返す
 */
export async function renderThumbnail(
	content: ThumbnailContent,
): Promise<Buffer> {
	const browser = await puppeteer.launch();
	try {
		const page = await browser.newPage();
		await page.setViewport({ width: WIDTH, height: HEIGHT });
		await page.setContent(buildHtml(content), { waitUntil: "load" });
		const screenshot = await page.screenshot({ type: "png" });
		return Buffer.from(screenshot);
	} finally {
		await browser.close();
	}
}

function buildHtml(content: ThumbnailContent): string {
	const tags = content.tags
		.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
		.join("");

	return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<style>
	* { box-sizing: border-box; margin: 0; }
	body {
		width: ${WIDTH}px;
		height: ${HEIGHT}px;
		padding: 80px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background: #1d232a;
		color: #ffffff;
		font-family: "Hiragino Sans", "Noto Sans JP", sans-serif;
	}
	.title {
		font-size: 64px;
		font-weight: 700;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		font-size: 32px;
	}
	.tags { display: flex; flex-wrap: wrap; gap: 16px; color: #a6adbb; }
	.site { font-weight: 700; }
</style>
</head>
<body>
	<h1 class="title">${escapeHtml(content.title)}</h1>
	<div class="footer">
		<div class="tags">${tags}</div>
		<div class="site">kanaru.me</div>
	</div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
