#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { config } from "dotenv";
import { AppStack } from "../lib/app-stack";
import { CloudFrontStack } from "../lib/cloudfront-stack";
import { InfrastructureStack } from "../lib/infrastructure-stack";

config({ path: `${__dirname}/../.env` });

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
  certificateArn: process.env.CERTIFICATE_ARN,
  domainName: process.env.DOMAIN_NAME,
};

if (!env.certificateArn || !env.domainName) {
  throw new Error("CERTIFICATE_ARN and DOMAIN_NAME must be set in .env file");
}

const infraStack = new InfrastructureStack(app, "InfrastructureStack", { env });
const appStack = new AppStack(app, "AppStack", {
  env,
  layerBucketArn: infraStack.getLayerBucketArn(),
});

new CloudFrontStack(app, "CloudFrontStack", {
  env,
  functionUrl: appStack.getFunctionUrl(),
  assetBucketArn: infraStack.getAssetBucketArn(),
  certificateArn: env.certificateArn,
  domainName: env.domainName,
  functionName: appStack.getFunctionName(),
});
