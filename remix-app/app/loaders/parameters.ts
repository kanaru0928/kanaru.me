import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const credentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION,
  credentials,
});

let githubToken: string | null = null;
export async function getGitHubToken() {
  "use server";
  
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
