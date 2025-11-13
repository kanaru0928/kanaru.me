/**
 * 環境変数を管理するユーティリティ
 */

export interface EnvConfig {
	apiBaseUrl: string;
	s3BucketName: string;
	initialBearerToken: string;
	functionName: string;
	awsRegion: string;
	awsProfile?: string;
}

/**
 * 環境変数から設定を取得
 */
export function getEnvConfig(options: {
	profile?: string;
	functionName?: string;
}): EnvConfig {
	const apiBaseUrl = process.env.API_BASE_URL;
	if (!apiBaseUrl) {
		throw new Error("環境変数 API_BASE_URL が設定されていません");
	}

	const s3BucketName = process.env.S3_BUCKET_NAME;
	if (!s3BucketName) {
		throw new Error("環境変数 S3_BUCKET_NAME が設定されていません");
	}

	const initialBearerToken = process.env.INITIAL_BEARER_TOKEN;
	if (!initialBearerToken) {
		throw new Error("環境変数 INITIAL_BEARER_TOKEN が設定されていません");
	}

	// Lambda関数名の優先順位: --function > CMS_FUNCTION_NAME
	const functionName =
		options.functionName || process.env.CMS_FUNCTION_NAME || "";
	if (!functionName) {
		throw new Error(
			"Lambda関数名が指定されていません。--function オプションまたは環境変数 CMS_FUNCTION_NAME を設定してください",
		);
	}

	// AWSリージョン
	const awsRegion = process.env.AWS_REGION || "ap-northeast-1";

	// AWSプロファイルの優先順位: --profile > AWS_PROFILE > AWS_DEFAULT_PROFILE
	const awsProfile =
		options.profile ||
		process.env.AWS_PROFILE ||
		process.env.AWS_DEFAULT_PROFILE;

	return {
		apiBaseUrl,
		s3BucketName,
		initialBearerToken,
		functionName,
		awsRegion,
		awsProfile,
	};
}
