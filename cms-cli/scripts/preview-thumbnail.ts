/**
 * サムネイルテンプレートのプレビューサーバー
 *
 * リクエストのたびにテンプレートを読み込むため、thumbnail.eta を保存してブラウザを再読み込みすると反映される
 */
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import {
	loadImageAsDataUrl,
	renderThumbnailHtml,
	type ThumbnailContent,
} from "../src/lib/image/thumbnail.ts";

const PORT = 3100;
const WIDTH = 1200;
const HEIGHT = 630;

// アイキャッチ画像のサンプルとしてサイトのアイコンを使う
const SAMPLE_IMAGE_PATH = fileURLToPath(
	new URL(
		"../../web/app/features/top-page/images/icon@512.webp",
		import.meta.url,
	),
);

const SAMPLES: ThumbnailContent[] = [
	{ title: "Hello, World", tags: ["日記"] },
	{
		title: "React Router v7 と Go で個人サイトの CMS を作り直した話",
		tags: ["react", "go", "aws"],
	},
	{
		title:
			"Cognito の Authorization Code + PKCE を CLI から使うときに localhost のコールバックで認可コードを受け取る方法と、その際に気をつけるべきポイントのまとめ",
		tags: ["aws", "cognito", "oauth"],
	},
	{
		title: "2026 年の開発環境",
		tags: [
			"typescript",
			"react-router",
			"tailwindcss",
			"daisyui",
			"biome",
			"vite",
			"aws-cdk",
			"go",
			"puppeteer",
		],
	},
	{
		title: "絵文字のアイキャッチ",
		tags: ["日記"],
		eyecatchEmoji: "🚀",
	},
	{
		title: "画像のアイキャッチ",
		tags: ["日記"],
		eyecatchImage: await loadImageAsDataUrl(SAMPLE_IMAGE_PATH),
	},
];

const server = createServer((req, res) => {
	const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

	try {
		const match = url.pathname.match(/^\/samples\/(\d+)$/);
		if (match) {
			const sample = SAMPLES[Number(match[1])];
			if (!sample) {
				res.writeHead(404).end();
				return;
			}
			// 描画で例外が出たときに catch で 500 を返せるよう、ヘッダー送信より先に描画する
			const html = renderThumbnailHtml(sample);
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(html);
			return;
		}

		if (url.pathname === "/") {
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(buildIndexHtml());
			return;
		}

		res.writeHead(404).end();
	} catch (error) {
		// テンプレートの構文エラーをブラウザに表示する
		res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
		res.end(error instanceof Error ? error.stack : String(error));
	}
});

server.listen(PORT, "localhost", () => {
	console.log(`プレビュー: http://localhost:${PORT}`);
});

function buildIndexHtml(): string {
	const frames = SAMPLES.map(
		(_, index) =>
			`<iframe src="/samples/${index}" width="${WIDTH}" height="${HEIGHT}"></iframe>`,
	).join("\n");

	return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>サムネイルプレビュー</title>
<style>
	body { margin: 24px; background: #888888; }
	iframe { display: block; margin-bottom: 24px; border: 0; }
</style>
</head>
<body>
${frames}
</body>
</html>`;
}
