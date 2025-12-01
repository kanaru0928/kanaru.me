import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as customResource from "aws-cdk-lib/custom-resources";

type Props = cdk.StackProps & {
  certificateArn: string;
  domainName?: string;
  githubToken: string;
  environmentName: string;
};

export class AppStack extends cdk.Stack {
  private readonly certificateArn: string;
  private readonly domainName?: string;
  private readonly githubToken: string;
  private readonly environmentName: string;

  private assetBucket: s3.Bucket;
  private lambdaLayerVersion: lambda.LayerVersion;
  private webFunction: lambda.Function;
  private functionUrl: lambda.FunctionUrl;
  private articleTable: dynamodb.TableV2;
  private articleBucket: s3.Bucket;
  private apiFunction: lambda.Function;
  private apiFunctionUrl: lambda.FunctionUrl;
  private distribution: cloudfront.Distribution;
  private warmerFunction: lambda.Function;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    if (!props) {
      throw new Error("Props must be provided");
    }
    this.certificateArn = props.certificateArn;
    this.domainName = props.domainName === "" ? undefined : props.domainName;
    this.githubToken = props.githubToken;
    this.environmentName = props.environmentName;

    this.assetBucket = this.createAssetBucket();

    this.lambdaLayerVersion = this.createLambdaLayerVersion();
    this.webFunction = this.createLambda();
    this.functionUrl = this.createFunctionUrl();

    this.articleTable = this.createArticleTable();
    this.articleBucket = this.createArticleBucket();
    this.apiFunction = this.createApiFunction();
    this.apiFunctionUrl = this.createApiFunctionUrl();

    this.distribution = this.createDistribution();

    this.warmerFunction = this.createWarmerFunction();
    this.createWarmerEventBridge();
    this.grantOACAccess();
    this.updateApiFunctionEnv();
    this.updateWebFunctionEnv();
  }

  private createAssetBucket() {
    return new s3.Bucket(this, "WebAssetBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-assets-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }

  private createLambdaLayerVersion() {
    return new lambda.LayerVersion(this, "KanarumeWebLayer", {
      code: lambda.Code.fromAsset("../web/layer/layer.zip"),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
    });
  }

  private createLambda() {
    const lambdaFunction = new lambda.Function(this, "KanarumeWebFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../web", {
        exclude: ["node_modules", "app", "layer", "server"],
      }),
      layers: [this.lambdaLayerVersion],
      timeout: cdk.Duration.minutes(3),
      memorySize: 1024,
      architecture: lambda.Architecture.ARM_64,
    });

    return lambdaFunction;
  }

  private createFunctionUrl() {
    const functionUrl = this.webFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    return functionUrl;
  }

  private createArticleTable() {
    return new dynamodb.TableV2(this, `ArticlesTable`, {
      partitionKey: {
        name: "slug",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }

  private createArticleBucket() {
    return new s3.Bucket(this, `ArticleBucket`, {
      bucketName: `${this.account}-kanaru-me-articles-storage-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }

  private createApiFunction() {
    return new lambda.Function(this, `APIFunction`, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../api/dist"),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["dynamodb:*"],
          resources: [this.articleTable.tableArn],
        }),
        new iam.PolicyStatement({
          actions: ["s3:*"],
          resources: [
            this.articleBucket.bucketArn,
            `${this.articleBucket.bucketArn}/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: ["ssm:GetParameter"],
          resources: [`arn:aws:ssm:${this.region}:${this.account}:*`],
        }),
      ],
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "AWSLambdaPowertoolsLayer",
          "arn:aws:lambda:ap-northeast-1:133490724326:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:21"
        ),
      ],
      timeout: cdk.Duration.minutes(1),
      memorySize: 512,
      architecture: lambda.Architecture.ARM_64,
    });
  }

  private createApiFunctionUrl() {
    const functionUrl = this.apiFunction.addFunctionUrl({
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
      }
    );

    // Lambda Function URL用のOrigin設定
    const webFunctionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", this.functionUrl.url)),
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      }
    );

    const apiFunctionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", this.apiFunctionUrl.url)),
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      }
    );

    // S3用のOrigin設定（OACで自動的にバケットポリシー設定）
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
      this.assetBucket
    );

    const articleOrigin = origins.S3BucketOrigin.withOriginAccessControl(
      this.articleBucket
    );

    // ACM証明書の参照
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      this.certificateArn
    );

    // CloudFront Distribution作成
    return new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: webFunctionUrlOrigin,
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
        "/api/articles*": {
          origin: apiFunctionUrlOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
        "/static/articles/*": {
          origin: articleOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
      },
      certificate: certificate,
      domainNames: this.domainName ? [this.domainName] : undefined,
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
        FUNCTION_NAME: this.webFunction.functionName,
      },
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
    });

    // Warmer関数にWebFunctionを呼び出す権限を付与
    this.webFunction.grantInvoke(warmerFunction);

    return warmerFunction;
  }

  private grantOACAccess() {
    // Lambda Function への OAC アクセス許可
    this.webFunction.addPermission("CloudFrontWebInvokePermission", {
      principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      functionUrlAuthType: lambda.FunctionUrlAuthType.AWS_IAM,
      sourceArn: this.distribution.distributionArn,
    });

    this.apiFunction.addPermission("CloudFrontApiInvokePermission", {
      principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      functionUrlAuthType: lambda.FunctionUrlAuthType.AWS_IAM,
      sourceArn: this.distribution.distributionArn,
    });
  }

  private updateApiFunctionEnv() {
    const domainName =
      this.domainName || this.distribution.distributionDomainName;
    const allowedOrigins = [`https://${domainName}`];
    const apiCutomResource = new customResource.AwsCustomResource(
      this,
      "UpdateApiFunctionEnvCR",
      {
        onUpdate: {
          service: "Lambda",
          action: "updateFunctionConfiguration",
          parameters: {
            FunctionName: this.apiFunction.functionName,
            Environment: {
              Variables: {
                DYNAMODB_TABLE_NAME: this.articleTable.tableName,
                S3_BUCKET_NAME: this.articleBucket.bucketName,
                S3_ORIGIN_URL: `https://${domainName}`,
                S3_KEY_PREFIX: "static/articles/",
                SECRET_NAME_PREFIX: `/kanaru.me-v2/${this.environmentName}/`,
                SSM_PARAMETER_STORE_TTL: "300",
                ALLOWED_ORIGINS: allowedOrigins.join(","),
              },
            },
          },
          physicalResourceId: customResource.PhysicalResourceId.of(
            `${this.apiFunction.functionName}-env-update`
          ),
        },
        policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.apiFunction.functionArn],
        }),
      }
    );

    apiCutomResource.node.addDependency(this.articleTable);
    apiCutomResource.node.addDependency(this.articleBucket);
    apiCutomResource.node.addDependency(this.apiFunction);
    apiCutomResource.node.addDependency(this.distribution);
  }

  private updateWebFunctionEnv() {
    // const domainName =
    //   this.domainName || this.distribution.distributionDomainName;
    // const webCutomResource = new customResource.AwsCustomResource(
    //   this,
    //   "UpdateWebFunctionEnvCR",
    //   {
    //     onUpdate: {
    //       service: "Lambda",
    //       action: "updateFunctionConfiguration",
    //       parameters: {
    //         FunctionName: this.webFunction.functionName,
    //         Environment: {
    //           Variables: {
    //             GITHUB_TOKEN: this.githubToken,
    //             API_BASE_URL: `https://${domainName}/`,
    //           },
    //         },
    //       },
    //       physicalResourceId: customResource.PhysicalResourceId.of(
    //         `${this.webFunction.functionName}-env-update`
    //       ),
    //     },
    //     policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
    //       resources: [this.webFunction.functionArn],
    //     }),
    //   }
    // );

    // webCutomResource.node.addDependency(this.webFunction);
    // webCutomResource.node.addDependency(this.distribution);
  }
}
