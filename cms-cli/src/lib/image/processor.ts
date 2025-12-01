/**
 * 画像処理ユーティリティ
 */
import sharp from "sharp";

export interface ProcessImageOptions {
	maxSize?: number; // デフォルト: 1000
	quality?: number; // デフォルト: 80
}

export interface ProcessedImage {
	buffer: Buffer;
	width: number;
	height: number;
	format: "webp";
}

/**
 * 画像を WebP に変換し、必要に応じてリサイズ
 */
export async function processImage(
	inputPath: string,
	options: ProcessImageOptions = {},
): Promise<ProcessedImage> {
	const maxSize = options.maxSize ?? 1000;
	const quality = options.quality ?? 80;

	// Sharp で画像を読み込み
	const image = sharp(inputPath);

	// メタデータを取得
	const metadata = await image.metadata();
	const originalWidth = metadata.width ?? 0;
	const originalHeight = metadata.height ?? 0;

	// リサイズが必要かどうかを判定
	const needsResize = originalWidth > maxSize || originalHeight > maxSize;

	// リサイズ処理
	let resizedImage = image;
	if (needsResize) {
		resizedImage = image.resize(maxSize, maxSize, {
			fit: "inside",
			withoutEnlargement: true,
		});
	}

	// WebP に変換して Buffer を取得
	const buffer = await resizedImage.webp({ quality }).toBuffer();

	// 変換後のメタデータを取得
	const processedMetadata = await sharp(buffer).metadata();
	const width = processedMetadata.width ?? 0;
	const height = processedMetadata.height ?? 0;

	return {
		buffer,
		width,
		height,
		format: "webp",
	};
}
