import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

type Props = cdk.StackProps & {
  environmentName: string;
};

export class InfrastructureStack extends cdk.Stack {
  private layerBucketArn: string;
  private environmentName: string;

  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    if (!props) {
      throw new Error("Props must be provided");
    }
    this.environmentName = props.environmentName;

    this.layerBucketArn = this.createLayerS3();
  }

  private createLayerS3() {
    const bucket = new s3.Bucket(this, "WebLayerBucket", {
      bucketName: `${this.account}-kanaru-me-v2-web-layer-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    return bucket.bucketArn;
  }

  public getLayerBucketArn(): string {
    return this.layerBucketArn;
  }
}
