import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import type { Handler } from "aws-lambda";

const FUNCTION_NAME = process.env.FUNCTION_NAME;
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-1";

const lambdaClient = new LambdaClient({ region: AWS_REGION });

export const handler: Handler = async (event) => {
	console.log("Warmer function triggered", event);

	if (!FUNCTION_NAME) {
		throw new Error("FUNCTION_NAME environment variable is not set");
	}

	try {
		// Lambda関数を直接呼び出し
		const command = new InvokeCommand({
			FunctionName: FUNCTION_NAME,
			InvocationType: "RequestResponse",
		});

		const response = await lambdaClient.send(command);

		if (response.FunctionError) {
			throw new Error(
				`Function invocation failed: ${response.FunctionError}`,
			);
		}

		console.log("Successfully warmed up the function");

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Function warmed up successfully",
			}),
		};
	} catch (error) {
		console.error("Error warming up function:", error);
		throw error;
	}
};
