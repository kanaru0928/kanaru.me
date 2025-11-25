#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { config } from "dotenv";
import { AppStack } from "../lib/app-stack";
import { InfrastructureStack } from "../lib/infrastructure-stack";

config({ path: `${__dirname}/../.env` });

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  certificateArn: process.env.CERTIFICATE_ARN,
  domainName: process.env.DOMAIN_NAME,
  githubToken: process.env.GITHUB_TOKEN,
  environmentName: process.env.ENVIRONMENT_NAME,
};

if (!env.certificateArn || !env.githubToken || !env.environmentName) {
  throw new Error("CERTIFICATE_ARN, GITHUB_TOKEN and ENVIRONMENT_NAME must be set in .env file");
}

const infraStack = new InfrastructureStack(app, `InfrastructureStack-${env.environmentName}`, { env, environmentName: env.environmentName });
new AppStack(app, `AppStack-${env.environmentName}`, {
  env,
  layerBucketArn: infraStack.getLayerBucketArn(),
  certificateArn: env.certificateArn,
  domainName: env.domainName,
  githubToken: env.githubToken,
  environmentName: env.environmentName,
});
