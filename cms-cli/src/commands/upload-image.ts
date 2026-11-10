/**
 * upload-imageコマンド - 画像のアップロード
 */

import type { ApiClient } from "../lib/api/client.js";
import { processImage } from "../lib/image/processor.js";
import { uploadThumbnail } from "../lib/image/uploader.js";
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
	apiClient: ApiClient,
	apiBaseUrl: string,
	options: UploadImageCommandOptions,
): Promise<void> {
	logger.info(`画像を処理中: ${filePath}`);

	// 画像を変換
	const processed = await processImage(filePath, {
		maxSize: options.maxSize,
		quality: options.quality,
	});

	logger.info(`  変換後のサイズ: ${processed.width}x${processed.height}`);

	logger.info("画像をアップロード中");
	const path = await uploadThumbnail(apiClient, processed.buffer);

	logger.success("画像のアップロードに成功しました");

	// URL のみを標準出力（スクリプトから利用可能にするため）
	console.log(`${apiBaseUrl}${path}`);
}
