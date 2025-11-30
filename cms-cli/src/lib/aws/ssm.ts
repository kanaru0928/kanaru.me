import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

/**
 * SSM Parameter Store からパラメータを取得
 */
export async function getSSMParameter(
	parameterName: string,
	region: string,
): Promise<string | null> {
	try {
		const client = new SSMClient({ region });
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
