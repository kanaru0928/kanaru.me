import * as cdk from "aws-cdk-lib";
import type * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

type Props = cdk.StackProps & {
  layerBucketArn: string;
};

export class AppStack extends cdk.Stack {
  private lambdaLayerVersion: lambda.LayerVersion;
  private lambdaFunction: lambda.Function;
  private functionUrl: lambda.FunctionUrl;
  private layerBucketArn: string;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    if (!props?.layerBucketArn) {
      throw new Error("layerBucketArn is required");
    }
    this.layerBucketArn = props?.layerBucketArn;

    this.lambdaLayerVersion = this.createLambdaLayerVersion();
    this.lambdaFunction = this.createLambda();
    this.functionUrl = this.createFunctionUrl();
  }

  private createLambdaLayerVersion() {
    const layerBucket = s3.Bucket.fromBucketArn(
      this,
      "ImportedLayerBucket",
      this.layerBucketArn,
    );
    return new lambda.LayerVersion(this, "KanarumeWebLayer", {
      code: lambda.Code.fromBucketV2(layerBucket, "layer.zip"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      description: "Node modules for kanaru.me web app",
    });
  }

  private createLambda() {
    const lambdaFunction = new lambda.Function(this, "KanarumeWebFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../web", {
        exclude: ["node_modules"],
      }),
      layers: [this.lambdaLayerVersion],
      functionName: "kanarume-me-web-function",
    });

    return lambdaFunction;
  }

  private createFunctionUrl() {
    const functionUrl = this.lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    return functionUrl;
  }

  public getFunctionUrl(): lambda.FunctionUrl {
    return this.functionUrl;
  }

  public grantInvokeUrl(grantee: iam.IGrantable): void {
    this.lambdaFunction.grantInvokeUrl(grantee);
  }
}
