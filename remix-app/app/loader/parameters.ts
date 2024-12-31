import { SSMClient } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({region: process.env.AWS_REGION});

export function getGitHubToken {
  
}