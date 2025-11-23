import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

type Props = cdk.StackProps & {
  layerBucketArn: string;
  certificateArn: string;
  domainName: string;
  githubToken: string;
};

export class AppStack extends cdk.Stack {
  private lambdaLayerVersion: lambda.LayerVersion;
  private lambdaFunction: lambda.Function;
  private functionUrl: lambda.FunctionUrl;
  private layerBucketArn: string;
  private warmerFunction: lambda.Function;
  private assetBucket: s3.Bucket;
  private distribution: cloudfront.Distribution;
  private certificateArn: string;
  private domainName: string;
  private githubToken: string;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    if (!props?.layerBucketArn || !props?.certificateArn || !props?.domainName || !props?.githubToken) {
      throw new Error("layerBucketArn, certificateArn, domainName and githubToken are required");
    }
    this.layerBucketArn = props.layerBucketArn;
    this.certificateArn = props.certificateArn;
    this.domainName = props.domainName;
    this.githubToken = props.githubToken;

    this.assetBucket = this.createAssetBucket();
    this.lambdaLayerVersion = this.createLambdaLayerVersion();
    this.lambdaFunction = this.createLambda();
    this.functionUrl = this.createFunctionUrl();
    this.distribution = this.createDistribution();
    this.warmerFunction = this.createWarmerFunction();
    this.createWarmerEventBridge();
    this.grantOACAccess();
  }

  private createAssetBucket() {
    return new s3.Bucket(this, "WebAssetBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-assets`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
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
      timeout: cdk.Duration.minutes(3),
      memorySize: 1024,
      environment: {
        GITHUB_TOKEN: this.githubToken,
      },
      architecture: lambda.Architecture.ARM_64,
    });

    return lambdaFunction;
  }

  private createFunctionUrl() {
    const functionUrl = this.lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    return functionUrl;
  }

  private createDistribution() {
    // Lambda Function URL用のOAC作成
    const lambdaOac = new cloudfront.FunctionUrlOriginAccessControl(
      this,
      "LambdaOAC",
      {
        signing: cloudfront.Signing.SIGV4_ALWAYS,
      },
    );

    // Lambda Function URL用のOrigin設定
    const functionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", this.functionUrl.url)),
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      },
    );

    // S3用のOrigin設定（OACで自動的にバケットポリシー設定）
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
      this.assetBucket
    );

    // ACM証明書の参照
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      this.certificateArn,
    );

    // CloudFront Distribution作成
    return new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: functionUrlOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy:
          cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      },
      additionalBehaviors: {
        "/assets/*": {
          origin: s3Origin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
      },
      certificate: certificate,
      domainNames: [this.domainName],
      enableLogging: false,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
    });
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
      environment: {
        FUNCTION_NAME: this.lambdaFunction.functionName,
      },
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
    });

    // Warmer関数にWebFunctionを呼び出す権限を付与
    this.lambdaFunction.grantInvoke(warmerFunction);

    return warmerFunction;
  }

  private grantOACAccess() {
    // Lambda Function への OAC アクセス許可
    this.lambdaFunction.addPermission("CloudFrontInvokePermission", {
      principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      functionUrlAuthType: lambda.FunctionUrlAuthType.AWS_IAM,
      sourceArn: this.distribution.distributionArn,
    });
  }
}
