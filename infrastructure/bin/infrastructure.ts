#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { config } from "dotenv";
import { AppStack } from "../lib/app-stack";

config({ path: `${__dirname}/../.env` });

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  certificateArn: process.env.CERTIFICATE_ARN,
  domainName: process.env.DOMAIN_NAME,
  githubToken: process.env.GITHUB_TOKEN,
  environmentName: process.env.ENVIRONMENT_NAME,
  buildHash: process.env.BUILD_HASH || process.env.GITHUB_SHA || "unknown",
};

if (!env.certificateArn || !env.githubToken || !env.environmentName) {
  throw new Error("CERTIFICATE_ARN, GITHUB_TOKEN, ENVIRONMENT_NAME must be set");
}

new AppStack(app, `AppStack-${env.environmentName}`, {
  env,
  certificateArn: env.certificateArn,
  domainName: env.domainName,
  githubToken: env.githubToken,
  environmentName: env.environmentName,
  buildHash: env.buildHash,
});
