import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

type Props = cdk.StackProps & {
  functionUrl: lambda.FunctionUrl;
  assetBucketArn: string;
  certificateArn: string;
  domainName: string;
  functionName: string;
};

export class CloudFrontStack extends cdk.Stack {
  private distribution: cloudfront.Distribution;
  private functionName: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    if (!props.functionUrl || !props.functionName) {
      throw new Error("functionUrl and functionName are required");
    }

    this.functionName = props.functionName;

    this.distribution = this.createDistribution(props);
    this.grantOACInvokeUrl();
  }

  private createDistribution(props: Props) {
    // Lambda Function URL用のOAC作成
    const lambdaOac = new cloudfront.FunctionUrlOriginAccessControl(
      this,
      "LambdaOAC",
      {
        signing: cloudfront.Signing.SIGV4_ALWAYS,
        originAccessControlName: "kanaru-me-web-lambda-oac",
      },
    );

    // Lambda Function URL用のOrigin設定
    const functionUrlOrigin = new origins.HttpOrigin(
      cdk.Fn.select(2, cdk.Fn.split("/", props.functionUrl.url)),
      {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        originAccessControlId: lambdaOac.originAccessControlId,
      },
    );

    const assetBucket = s3.Bucket.fromBucketArn(
      this,
      "ImportedAssetBucket",
      props.assetBucketArn,
    );

    // S3用のOrigin設定
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
      assetBucket
    );

    // ACM証明書の参照
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      props.certificateArn,
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
      domainNames: [props.domainName],
      enableLogging: false,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
    });
  }

  private grantOACInvokeUrl() {
    const lambdaFunction = lambda.Function.fromFunctionName(
      this,
      "ImportedLambdaFunction",
      this.functionName,
    );
    lambdaFunction.addPermission("CloudFrontInvokePermission", {
      principal: new cdk.aws_iam.ServicePrincipal("cloudfront.amazonaws.com"),
      action: "lambda:InvokeFunctionUrl",
      functionUrlAuthType: lambda.FunctionUrlAuthType.AWS_IAM,
      sourceArn: this.distribution.distributionArn,
    });
  }
}
