/**
 * 記事タイトル入りの OGP 画像を生成
 */
import { readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Eta } from "eta";
import puppeteer from "puppeteer";

const WIDTH = 1200;
const HEIGHT = 630;

// ビルド後は rollup.config.mjs が dist/templates に配置する
const eta = new Eta({
	views: join(dirname(fileURLToPath(import.meta.url)), "templates"),
});

// data URL に埋め込める画像の MIME タイプ
const IMAGE_MIME_TYPES: Record<string, string> = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
};

export interface ThumbnailContent {
	title: string;
	tags: string[];
	/** アイキャッチ画像の src（eyecatchEmoji より優先） */
	eyecatchImage?: string;
	/** アイキャッチの絵文字 */
	eyecatchEmoji?: string;
}

/**
 * 画像ファイルを data URL に変換
 *
 * page.setContent で開いたページからはローカルファイルを参照できないため、HTML に埋め込む
 */
export async function loadImageAsDataUrl(filePath: string): Promise<string> {
	const mimeType = IMAGE_MIME_TYPES[extname(filePath).toLowerCase()];
	if (!mimeType) {
		throw new Error(`対応していない画像形式です: ${filePath}`);
	}
	const data = await readFile(filePath);
	return `data:${mimeType};base64,${data.toString("base64")}`;
}

/**
 * テンプレートを HTML に描画
 */
export function renderThumbnailHtml(content: ThumbnailContent): string {
	return eta.render("./thumbnail", {
		...content,
		width: WIDTH,
		height: HEIGHT,
	});
}

/**
 * HTML テンプレートをスクリーンショットして PNG を返す
 */
export async function renderThumbnail(
	content: ThumbnailContent,
): Promise<Buffer> {
	const html = renderThumbnailHtml(content);

	const browser = await puppeteer.launch();
	try {
		const page = await browser.newPage();
		await page.setViewport({ width: WIDTH, height: HEIGHT });
		await page.setContent(html, { waitUntil: "load" });
		const screenshot = await page.screenshot({ type: "png" });
		return Buffer.from(screenshot);
	} finally {
		await browser.close();
	}
}
