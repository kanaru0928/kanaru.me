import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export class InfrastructureStack extends cdk.Stack {
  private layerBucketArn: string;
  private assetBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.assetBucket = this.createAssetS3();
    this.layerBucketArn = this.createLayerS3();
  }

  private createLayerS3() {
    const bucket = new s3.Bucket(this, "WebLayerBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-layer`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });
    return bucket.bucketArn;
  }

  private createAssetS3() {
    return new s3.Bucket(this, "WebAssetBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-assets`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }

  public getLayerBucketArn(): string {
    return this.layerBucketArn;
  }

  public getAssetBucketArn(): string {
    return this.assetBucket.bucketArn;
  }
}
