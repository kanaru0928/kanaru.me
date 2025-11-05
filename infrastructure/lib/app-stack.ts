import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
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
  private warmerFunction: lambda.Function;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    if (!props?.layerBucketArn) {
      throw new Error("layerBucketArn is required");
    }
    this.layerBucketArn = props?.layerBucketArn;

    this.lambdaLayerVersion = this.createLambdaLayerVersion();
    this.lambdaFunction = this.createLambda();
    this.functionUrl = this.createFunctionUrl();
    this.warmerFunction = this.createWarmerFunction();
    this.createWarmerEventBridge();
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
        exclude: ["node_modules", "app"],
      }),
      layers: [this.lambdaLayerVersion],
      functionName: "kanarume-me-web-function",
      timeout: cdk.Duration.minutes(3),
      memorySize: 1024,
    });

    return lambdaFunction;
  }

  private createFunctionUrl() {
    const functionUrl = this.lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    return functionUrl;
  }

  private createWarmerEventBridge() {
    // 5分ごとにトリガーするEventBridge Ruleを作成
    const rule = new events.Rule(this, "KanarumeWarmerScheduleRule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      description: "Trigger warmer function every 5 minutes",
    });

    // Warmer関数をターゲットとして追加
    rule.addTarget(new targets.LambdaFunction(this.warmerFunction));

    return rule;
  }

  private createWarmerFunction() {
    const warmerFunction = new lambda.Function(this, "KanarumeWarmerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../functions/warmer"),
      functionName: "kanarume-warmer-function",
      environment: {
        FUNCTION_NAME: this.lambdaFunction.functionName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Warmer関数にWebFunctionを呼び出す権限を付与
    this.lambdaFunction.grantInvoke(warmerFunction);

    return warmerFunction;
  }

  public getFunctionUrl(): lambda.FunctionUrl {
    return this.functionUrl;
  }

  public grantInvokeUrl(grantee: iam.IGrantable): void {
    this.lambdaFunction.grantInvokeUrl(grantee);
  }
}
