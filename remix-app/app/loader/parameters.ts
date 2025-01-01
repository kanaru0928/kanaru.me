import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { fromSSO } from "@aws-sdk/credential-providers";

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION,
});

let githubToken: string | null = null;
export async function getGitHubToken() {
  if (githubToken === null) {
    const ssmGetParameterCommand = new GetParameterCommand({
      Name: `/${process.env.APP_NAME}/${process.env.ENVIRONMENT}/github_token`,
      WithDecryption: true,
    });
    const store = await ssmClient.send(ssmGetParameterCommand);
    githubToken = store.Parameter?.Value || null;
  }

  return githubToken;
}
