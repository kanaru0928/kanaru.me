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
};

new InfrastructureStack(app, "InfrastructureStack", { env });
new AppStack(app, "AppStack", { env });
