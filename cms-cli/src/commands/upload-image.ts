/**
 * upload-imageコマンド - 画像のアップロード
 */

import { uploadImage } from "../lib/aws/s3.js";
import { generateMD5Hash } from "../lib/image/hasher.js";
import { processImage } from "../lib/image/processor.js";
import type { EnvConfig } from "../lib/utils/env.js";
import { logger } from "../lib/utils/logger.js";

export interface UploadImageCommandOptions {
	maxSize?: number;
	quality?: number;
}

/**
 * 画像をアップロード
 */
export async function uploadImageCommand(
	filePath: string,
	options: UploadImageCommandOptions,
	envConfig: EnvConfig,
): Promise<void> {
	logger.info(`画像を処理中: ${filePath}`);

	// 画像を変換
	const processed = await processImage(filePath, {
		maxSize: options.maxSize,
		quality: options.quality,
	});

	logger.info(`  変換後のサイズ: ${processed.width}x${processed.height}`);

	// MD5 ハッシュを生成
	const hash = generateMD5Hash(processed.buffer);
	const fileName = `${hash}.webp`;

	// S3 にアップロード
	const s3Key = `static/articles/images/${fileName}`;
	logger.info(`S3にアップロード中: ${s3Key}`);

	await uploadImage(processed.buffer, s3Key, {
		bucketName: envConfig.s3BucketName,
		region: envConfig.awsRegion,
		profile: envConfig.awsProfile,
	});

	// URL を構築
	const url = `${envConfig.apiBaseUrl}/static/articles/images/${fileName}`;

	logger.success("画像のアップロードに成功しました");

	// URL のみを標準出力（スクリプトから利用可能にするため）
	console.log(url);
}
