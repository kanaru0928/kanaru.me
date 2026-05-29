import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { getAwsConfig } from "./config.js";

/**
 * SSM Parameter Store からパラメータを取得
 */
export async function getSSMParameter(
	parameterName: string,
	region: string,
	profile?: string,
): Promise<string | null> {
	try {
		const awsConfig = getAwsConfig({ region, profile });
		const client = new SSMClient(awsConfig);
		const command = new GetParameterCommand({
			Name: parameterName,
			WithDecryption: true,
		});
		const response = await client.send(command);
		return response.Parameter?.Value || null;
	} catch (error) {
		// エラーログは出力するが、nullを返してフォールバック可能にする
		console.error(
			`Failed to get SSM parameter "${parameterName}":`,
			error instanceof Error ? error.message : error,
		);
		return null;
	}
}
