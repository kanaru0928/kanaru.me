#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { config } from "dotenv";
import { InfrastructureStack } from "../lib/infrastructure-stack";

config({ path: `${__dirname}/../.env` });

const app = new cdk.App();
new InfrastructureStack(app, "InfrastructureStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
