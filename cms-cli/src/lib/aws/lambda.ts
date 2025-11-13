/**
 * Lambda InvokeCommand（verify用）
 */
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { getAwsConfig } from "./config.js";

export interface LambdaInvokeOptions {
	functionName: string;
	region: string;
	profile?: string;
}

export interface VerifyResponse {
	token: string;
}

/**
 * Lambda InvokeCommandでverifyエンドポイントを呼び出し
 */
export async function invokeVerify(
	initialToken: string,
	options: LambdaInvokeOptions,
): Promise<VerifyResponse> {
	const awsConfig = getAwsConfig({
		region: options.region,
		profile: options.profile,
	});

	const client = new LambdaClient(awsConfig);

	// API Gateway互換のペイロード形式
	const payload = {
		httpMethod: "POST",
		path: "/api/verify",
		headers: {
			Authorization: `Bearer ${initialToken}`,
		},
		body: null,
	};

	try {
		const command = new InvokeCommand({
			FunctionName: options.functionName,
			Payload: JSON.stringify(payload),
		});

		const response = await client.send(command);

		if (!response.Payload) {
			throw new Error("Lambdaレスポンスが空です");
		}

		// ペイロードをデコード
		const payloadString = new TextDecoder().decode(response.Payload);
		const lambdaResponse = JSON.parse(payloadString);

		// Lambda実行エラーのチェック
		if (response.FunctionError) {
			throw new Error(
				`Lambda実行エラー: ${response.FunctionError} - ${payloadString}`,
			);
		}

		// API Gateway互換レスポンスから本文を抽出
		if (lambdaResponse.statusCode !== 200) {
			throw new Error(
				`認証失敗 (${lambdaResponse.statusCode}): ${lambdaResponse.body}`,
			);
		}

		const body = JSON.parse(lambdaResponse.body);

		if (!body.token) {
			throw new Error("JWTトークンがレスポンスに含まれていません");
		}

		return { token: body.token };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Lambda呼び出しに失敗しました: ${error.message}`);
		}
		throw error;
	}
}
