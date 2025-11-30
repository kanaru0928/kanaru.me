/**
 * 環境変数を管理するユーティリティ
 */

import { getSSMParameter } from "../aws/ssm.js";
import { logger } from "./logger.js";

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
export async function getEnvConfig(options: {
	profile?: string;
	functionName?: string;
	env?: string;
}): Promise<EnvConfig> {
	const apiBaseUrl = process.env.API_BASE_URL;
	if (!apiBaseUrl) {
		throw new Error("環境変数 API_BASE_URL が設定されていません");
	}

	const s3BucketName = process.env.S3_BUCKET_NAME;
	if (!s3BucketName) {
		throw new Error("環境変数 S3_BUCKET_NAME が設定されていません");
	}

	// AWSリージョン
	const awsRegion = process.env.AWS_REGION || "ap-northeast-1";

	// AWSプロファイルの優先順位: --profile > AWS_PROFILE > AWS_DEFAULT_PROFILE
	const awsProfile =
		options.profile ||
		process.env.AWS_PROFILE ||
		process.env.AWS_DEFAULT_PROFILE;

	// 環境名の決定
	const envName = options.env || "prod";

	// INITIAL_BEARER_TOKEN の取得
	// 優先順位: .env (既にprocess.envに読み込まれている) → SSM
	let initialBearerToken: string | null =
		process.env.INITIAL_BEARER_TOKEN || null;

	// .env に設定されていない場合のみ SSM から取得を試みる
	if (!initialBearerToken) {
		const ssmParameterName = `/kanaru.me-v2/${envName}/initial-bearer-token`;
		initialBearerToken = await getSSMParameter(ssmParameterName, awsRegion);

		if (initialBearerToken) {
			logger.info(
				`INITIAL_BEARER_TOKEN を SSM Parameter Store から取得しました: ${ssmParameterName}`,
			);
		}
	}

	if (!initialBearerToken) {
		throw new Error(
			"INITIAL_BEARER_TOKEN が設定されていません。.env ファイル、SSM Parameter Store、または環境変数で設定してください。",
		);
	}

	// Lambda関数名の優先順位: --function > CMS_FUNCTION_NAME
	const functionName =
		options.functionName || process.env.CMS_FUNCTION_NAME || "";
	if (!functionName) {
		throw new Error(
			"Lambda関数名が指定されていません。--function オプションまたは環境変数 CMS_FUNCTION_NAME を設定してください",
		);
	}

	return {
		apiBaseUrl,
		s3BucketName,
		initialBearerToken,
		functionName,
		awsRegion,
		awsProfile,
	};
}
