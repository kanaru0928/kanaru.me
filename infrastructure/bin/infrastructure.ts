#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { config } from "dotenv";
import { AppStack } from "../lib/app-stack";
import { BaseStack } from "../lib/base-stack";

config({ path: `${__dirname}/../.env` });

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  certificateArn: process.env.CERTIFICATE_ARN,
  domainName: process.env.DOMAIN_NAME,
  githubToken: process.env.GITHUB_TOKEN,
  environmentName: process.env.ENVIRONMENT_NAME,
  layerHash: process.env.LAYER_HASH,
};

if (!env.certificateArn || !env.githubToken || !env.environmentName || !env.layerHash) {
  throw new Error("CERTIFICATE_ARN, GITHUB_TOKEN, ENVIRONMENT_NAME and LAYER_HASH must be set");
}

const baseStack = new BaseStack(app, `BaseStack-${env.environmentName}`, {
  env,
  environmentName: env.environmentName,
});

new AppStack(app, `AppStack-${env.environmentName}`, {
  env,
  certificateArn: env.certificateArn,
  domainName: env.domainName,
  githubToken: env.githubToken,
  environmentName: env.environmentName,
  layerBucketName: baseStack.getLayerBucketName(),
  layerHash: env.layerHash,
});
