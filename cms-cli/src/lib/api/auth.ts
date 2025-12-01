/**
 * JWT認証管理
 */
import { invokeVerify } from "../aws/lambda.js";

export interface AuthManager {
	getToken(): Promise<string>;
}

/**
 * JWT認証マネージャーを作成
 */
export function createAuthManager(options: {
	initialToken: string;
	functionName: string;
	region: string;
	profile?: string;
}): AuthManager {
	let jwtToken: string | null = null;

	return {
		async getToken(): Promise<string> {
			// すでにJWTトークンを持っている場合はそれを返す
			if (jwtToken) {
				return jwtToken;
			}

			// Lambda InvokeCommandでverifyを呼び出してJWT取得
			const response = await invokeVerify(options.initialToken, {
				functionName: options.functionName,
				region: options.region,
				profile: options.profile,
			});

			jwtToken = response.token;
			return jwtToken;
		},
	};
}
