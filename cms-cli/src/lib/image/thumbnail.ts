/**
 * 記事タイトル入りの OGP 画像を生成
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Eta } from "eta";
import puppeteer from "puppeteer";

const WIDTH = 1200;
const HEIGHT = 630;

// ビルド後は rollup.config.mjs が dist/templates に配置する
const eta = new Eta({
	views: join(dirname(fileURLToPath(import.meta.url)), "templates"),
});

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
	const html = eta.render("./thumbnail", {
		...content,
		width: WIDTH,
		height: HEIGHT,
	});

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
