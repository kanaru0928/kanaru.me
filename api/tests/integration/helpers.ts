import { sign } from "hono/jwt";

/**
 * テスト用のJWTトークンを生成します
 * @param secret JWT署名用の秘密鍵
 * @param expiresIn 有効期限（秒）デフォルトは24時間
 * @returns JWT文字列
 */
export async function generateTestJwt(
	secret: string,
	expiresIn = 24 * 60 * 60,
): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		sub: "api-user",
		iat: now,
		exp: now + expiresIn,
	};
	return await sign(payload, secret);
}

/**
 * 期限切れのJWTトークンを生成します
 * @param secret JWT署名用の秘密鍵
 * @returns 期限切れのJWT文字列
 */
export async function generateExpiredJwt(secret: string): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		sub: "api-user",
		iat: now - 25 * 60 * 60, // 25時間前に発行
		exp: now - 1 * 60 * 60, // 1時間前に期限切れ
	};
	return await sign(payload, secret);
}

/**
 * KCMS-Authorizationヘッダーを含むHeadersオブジェクトを作成します
 * @param token JWTトークン
 * @returns Headersオブジェクト
 */
export function createAuthHeader(token: string): Headers {
	return new Headers({
		"Content-Type": "application/json",
		"KCMS-Authorization": `Bearer ${token}`,
	});
}
