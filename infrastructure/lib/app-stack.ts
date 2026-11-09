import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as customResource from "aws-cdk-lib/custom-resources";

const CMS_CONTENT_PREFIX = "contents";
// CloudFront Functions から参照するため、markdown-router.js と値を揃える
const WEB_ORIGIN_ID = "web";

type Props = cdk.StackProps & {
  certificateArn: string;
  domainName?: string;
  githubToken: string;
  environmentName: string;
  buildHash: string;
  providerClientId: string;
  providerClientSecret: string;
  providerIssuerUrl: string;
};

export class AppStack extends cdk.Stack {
  private readonly certificateArn: string;
  private readonly domainName?: string;
  private readonly githubToken: string;
  private readonly environmentName: string;
  private readonly buildHash: string;
  private readonly providerClientId: string;
  private readonly providerClientSecret: string;
  private readonly providerIssuerUrl: string;

  private assetBucket: s3.Bucket;
  private webFunction: lambda.Function;
  private functionUrl: lambda.FunctionUrl;
  private userPool: cognito.UserPool;
  private cmsTable: dynamodb.TableV2;
  private cmsBucket: s3.Bucket;
  private thumbnailBucket: s3.Bucket;
  private cmsFunction: lambda.Function;
  private cmsFunctionUrl: lambda.FunctionUrl;
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
    this.buildHash = props.buildHash;
    this.providerClientId = props.providerClientId;
    this.providerClientSecret = props.providerClientSecret;
    this.providerIssuerUrl = props.providerIssuerUrl;

    this.assetBucket = this.createAssetBucket();

    this.webFunction = this.createLambda();
    this.functionUrl = this.createFunctionUrl();

    this.userPool = this.createUserPool();

    this.cmsTable = this.createCmsTable();
    this.cmsBucket = this.createCmsBucket();
    this.thumbnailBucket = this.createThumbnailBucket();
    this.cmsFunction = this.createCmsFunction();
    this.cmsFunctionUrl = this.createCmsFunctionUrl();

    this.distribution = this.createDistribution();

    this.warmerFunction = this.createWarmerFunction();
    this.createWarmerEventBridge();
    this.grantOACAccess();
    this.updateWebFunctionEnv();
  }

  private createAssetBucket() {
    return new s3.Bucket(this, "WebAssetBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-assets-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }

  private createLambda() {
    const lambdaFunction = new lambda.Function(this, "KanarumeWebFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../web/deploy.zip"),
      timeout: cdk.Duration.minutes(3),
      memorySize: 1024,
      architecture: lambda.Architecture.ARM_64,
      environment: {
        GITHUB_TOKEN: this.githubToken,
        ...(this.domainName
          ? {
              API_BASE_URL: `https://${this.domainName}`,
            }
          : {}),
      },
    });

    return lambdaFunction;
  }

  private createFunctionUrl() {
    const functionUrl = this.webFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    return functionUrl;
  }

  private createUserPool() {
    const userPool = new cognito.UserPool(this, "KanarumeUserPool", {
      standardAttributes: {
        email: {
          required: true,
        },
      },
    });

    new cognito.UserPoolIdentityProviderOidc(this, "ExternalProvider", {
      userPool: userPool,
      clientId: this.providerClientId,
      clientSecret: this.providerClientSecret,
      issuerUrl: this.providerIssuerUrl,
      attributeMapping: {
        email: cognito.ProviderAttribute.other("email"),
      },
    });

    new cognito.UserPoolClient(this, "KanarumeUserPoolClient", {
      userPool: userPool,
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
      },
    });

    return userPool;
  }

  private createCmsTable() {
    return new dynamodb.TableV2(this, "CmsArticlesTable", {
      partitionKey: {
        name: "slug",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "item_type",
        type: dynamodb.AttributeType.STRING,
      },
      globalSecondaryIndexes: [
        {
          indexName: "GSI_StatusTag_UpdatedAt",
          partitionKeys: [
            { name: "status", type: dynamodb.AttributeType.STRING },
            { name: "filter_tag", type: dynamodb.AttributeType.STRING },
          ],
          sortKey: {
            name: "updated_at",
            type: dynamodb.AttributeType.STRING,
          },
          projectionType: dynamodb.ProjectionType.INCLUDE,
          nonKeyAttributes: [
            "title",
            "tags",
            "source",
            "content_key",
            "created_at",
            "pv",
            "thumbnail_url",
          ],
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }

  private createCmsBucket() {
    return new s3.Bucket(this, "CmsContentBucket", {
      bucketName: `${this.account}-kanaru-me-cms-contents-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }

  private createThumbnailBucket() {
    return new s3.Bucket(this, "CmsThumbnailBucket", {
      bucketName: `${this.account}-kanaru-me-cms-thumbnails-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
    });
  }

  private createCmsFunction() {
    const cmsFunction = new lambda.Function(this, "CmsFunction", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: "bootstrap",
      code: lambda.Code.fromAsset("../cms/dist"),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "LambdaWebAdapterLayer",
          `arn:aws:lambda:${this.region}:753240598075:layer:LambdaAdapterLayerArm64:30`,
        ),
      ],
      environment: {
        // Lambda Web Adapter の転送先のため、cmd/api が待ち受けるポートと揃える
        PORT: "3000",
        JWKS_URL: `https://cognito-idp.${this.region}.amazonaws.com/${this.userPool.userPoolId}/.well-known/jwks.json`,
        S3_BUCKET_NAME: this.cmsBucket.bucketName,
        S3_PREFIX: `${CMS_CONTENT_PREFIX}/`,
        DYNAMODB_TABLE_NAME: this.cmsTable.tableName,
        THUMBNAIL_S3_BUCKET_NAME: this.thumbnailBucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      architecture: lambda.Architecture.ARM_64,
    });

    this.cmsTable.grantReadWriteData(cmsFunction);
    this.cmsBucket.grantReadWrite(cmsFunction);
    // 署名付き URL でのアップロードは cms の権限で実行される
    this.thumbnailBucket.grantPut(cmsFunction);

    return cmsFunction;
  }

  private createCmsFunctionUrl() {
    return this.cmsFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });
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
    const webFunctionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", this.functionUrl.url)),
      {
        originId: WEB_ORIGIN_ID,
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      },
    );

    // S3用のOrigin設定（OACで自動的にバケットポリシー設定）
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
      this.assetBucket,
    );

    const cmsFunctionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", this.cmsFunctionUrl.url)),
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      },
    );

    const cmsContentOrigin = origins.S3BucketOrigin.withOriginAccessControl(
      this.cmsBucket,
      {
        originPath: `/${CMS_CONTENT_PREFIX}`,
      },
    );

    const thumbnailOrigin = origins.S3BucketOrigin.withOriginAccessControl(
      this.thumbnailBucket,
    );

    // ACM証明書の参照
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      this.certificateArn,
    );

    const shortCachePolicy = new cloudfront.CachePolicy(
      this,
      "ShortCachePolicy",
      {
        comment: "Cache policy with short TTL",
        defaultTtl: cdk.Duration.seconds(10),
        maxTtl: cdk.Duration.hours(1),
        minTtl: cdk.Duration.seconds(1),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      },
    );

    const cmsApiCachePolicy = new cloudfront.CachePolicy(
      this,
      "CmsApiCachePolicy",
      {
        comment: "Cache policy for CMS API",
        defaultTtl: cdk.Duration.seconds(0),
        maxTtl: cdk.Duration.days(1),
        minTtl: cdk.Duration.seconds(0),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        // 認証ヘッダーをオリジンに転送するため、キャッシュキーに含める
        headerBehavior:
          cloudfront.CacheHeaderBehavior.allowList("KCMS-Authorization"),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      },
    );

    const articleCachePolicy = new cloudfront.CachePolicy(
      this,
      "ArticleCachePolicy",
      {
        comment: "Cache policy for articles",
        defaultTtl: cdk.Duration.seconds(0),
        maxTtl: cdk.Duration.days(1),
        minTtl: cdk.Duration.seconds(0),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList("h"),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      },
    );

    const markdownRouter = new cloudfront.Function(this, "MarkdownRouter", {
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "functions/markdown-router.js"),
      }),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    // CloudFront Distribution作成
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: webFunctionUrlOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: shortCachePolicy,
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
        "/*.data": {
          origin: webFunctionUrlOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: shortCachePolicy,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
        "/api/*": {
          origin: cmsFunctionUrlOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cmsApiCachePolicy,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
        "/thumbnails/*": {
          origin: thumbnailOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
        "/articles/*.md": {
          origin: cmsContentOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: articleCachePolicy,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          functionAssociations: [
            {
              function: markdownRouter,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
        },
        "/articles/*": {
          origin: webFunctionUrlOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: articleCachePolicy,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
      },
      certificate: certificate,
      domainNames: this.domainName ? [this.domainName] : undefined,
      enableLogging: false,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
    });

    distribution.addBehavior("/*.*", s3Origin, {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: shortCachePolicy,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    });

    return distribution;
  }

  private createWarmerEventBridge() {
    // 5分ごとにトリガーするEventBridge Ruleを作成
    const rule = new events.Rule(this, "KanarumeWarmerScheduleRule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(3)),
      description: "Trigger warmer function every 3 minutes",
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
        FUNCTION_NAMES: [this.webFunction.functionName].join(","),
      },
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
    });

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

    this.cmsFunction.addPermission("CloudFrontCmsInvokePermission", {
      principal: new iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      functionUrlAuthType: lambda.FunctionUrlAuthType.AWS_IAM,
      sourceArn: this.distribution.distributionArn,
    });
  }

  private updateWebFunctionEnv() {
    const domainName =
      this.domainName || this.distribution.distributionDomainName;

    const webCutomResource = new customResource.AwsCustomResource(
      this,
      "UpdateWebFunctionEnvCR",
      {
        onUpdate: {
          service: "Lambda",
          action: "updateFunctionConfiguration",
          parameters: {
            FunctionName: this.webFunction.functionName,
            Environment: {
              Variables: {
                GITHUB_TOKEN: this.githubToken,
                API_BASE_URL: `https://${domainName}`,
              },
            },
          },
          physicalResourceId: customResource.PhysicalResourceId.of(
            `${this.webFunction.functionName}-${this.buildHash}-env-update`,
          ),
        },
        policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [this.webFunction.functionArn],
        }),
      },
    );

    webCutomResource.node.addDependency(this.webFunction);
    webCutomResource.node.addDependency(this.distribution);
  }
}
