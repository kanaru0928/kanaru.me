/**
 * AWS SDK設定
 */

export interface AwsConfig {
	region: string;
	profile?: string;
}

/**
 * AWS SDK設定を取得
 */
export function getAwsConfig(options: {
	region: string;
	profile?: string;
}): AwsConfig {
	const config: AwsConfig = {
		region: options.region,
	};

	// プロファイルが指定されている場合は環境変数経由で使用される
	if (options.profile) {
		config.profile = options.profile;
		// AWS_PROFILEを設定することでSDKが自動的にそのプロファイルを使用
		process.env.AWS_PROFILE = options.profile;
	}

	return config;
}
