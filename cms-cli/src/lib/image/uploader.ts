/**
 * サムネイル画像のアップロード
 */
import type { ApiClient } from "../api/client.js";
import { generateMD5Hash } from "./hasher.js";

/**
 * WebP 画像を署名付き URL 経由でアップロードし、配信パスを返す
 */
export async function uploadThumbnail(
	apiClient: ApiClient,
	buffer: Buffer,
): Promise<string> {
	const md5 = generateMD5Hash(buffer);
	const { uploadUrl, url } = await apiClient.createThumbnailUploadUrl(md5);

	const response = await fetch(uploadUrl, {
		method: "PUT",
		headers: {
			"Content-Type": "image/webp",
			// 署名に含まれるため、発行時の MD5 と同じ値を Base64 で指定する
			"Content-MD5": Buffer.from(md5, "hex").toString("base64"),
		},
		body: new Uint8Array(buffer),
	});

	if (!response.ok) {
		throw new Error(
			`画像のアップロードに失敗しました (${response.status}): ${await response.text()}`,
		);
	}

	return url;
}
