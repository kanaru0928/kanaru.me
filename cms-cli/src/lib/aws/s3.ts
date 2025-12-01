/**
 * S3Client（記事本文取得・画像アップロード）
 */
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getAwsConfig } from "./config.js";

export interface S3Options {
	bucketName: string;
	region: string;
	profile?: string;
}

/**
 * S3からマークダウンファイルを取得
 */
export async function getArticleContent(
	s3Key: string,
	options: S3Options,
): Promise<string> {
	const awsConfig = getAwsConfig({
		region: options.region,
		profile: options.profile,
	});

	const client = new S3Client(awsConfig);

	try {
		const command = new GetObjectCommand({
			Bucket: options.bucketName,
			Key: s3Key,
		});

		const response = await client.send(command);

		if (!response.Body) {
			throw new Error("S3オブジェクトの本文が空です");
		}

		// Streamを文字列に変換
		const bodyString = await response.Body.transformToString("utf-8");

		return bodyString;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`S3からの取得に失敗しました (Key: ${s3Key}): ${error.message}`,
			);
		}
		throw error;
	}
}

/**
 * S3に画像をアップロード
 */
export async function uploadImage(
	buffer: Buffer,
	key: string,
	options: S3Options,
): Promise<void> {
	const awsConfig = getAwsConfig({
		region: options.region,
		profile: options.profile,
	});

	const client = new S3Client(awsConfig);

	try {
		const command = new PutObjectCommand({
			Bucket: options.bucketName,
			Key: key,
			Body: buffer,
			ContentType: "image/webp",
		});

		await client.send(command);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`S3へのアップロードに失敗しました (Key: ${key}): ${error.message}`,
			);
		}
		throw error;
	}
}
