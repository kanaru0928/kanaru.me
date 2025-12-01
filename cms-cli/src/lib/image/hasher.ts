/**
 * ハッシュ生成ユーティリティ
 */
import { createHash } from "node:crypto";

/**
 * Buffer から MD5 ハッシュを生成
 */
export function generateMD5Hash(buffer: Buffer): string {
	const hash = createHash("md5").update(buffer).digest("hex");
	return hash;
}
