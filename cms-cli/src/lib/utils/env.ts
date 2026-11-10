/**
 * 環境変数を管理するユーティリティ
 */

export interface EnvConfig {
	apiBaseUrl: string;
	cognitoDomain: string;
	cognitoClientId: string;
}

/**
 * 環境変数から設定を取得
 */
export function getEnvConfig(): EnvConfig {
	return {
		apiBaseUrl: getRequiredEnv("API_BASE_URL"),
		cognitoDomain: getRequiredEnv("COGNITO_DOMAIN"),
		cognitoClientId: getRequiredEnv("COGNITO_CLIENT_ID"),
	};
}

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`環境変数 ${name} が設定されていません`);
	}
	return value;
}
