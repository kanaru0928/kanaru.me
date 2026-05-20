import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

type BaseStackProps = cdk.StackProps & {
  environmentName: string;
};

export class BaseStack extends cdk.Stack {
  private readonly environmentName: string;

  private layerBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    if (!props?.environmentName) {
      throw new Error("environmentName is required in BaseStackProps");
    }

    this.environmentName = props.environmentName;

    this.layerBucket = this.createLayerBucket();
  }

  private createLayerBucket() {
    return new s3.Bucket(this, "LambdaLayerBucket", {
      bucketName: `${this.account}-kanarume-v2-${this.environmentName}-lambda-layers`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(7),
          enabled: true,
          id: "ExpireOldLayers",
        }
      ]
    });
  }

  public getLayerBucketName(): string {
    return this.layerBucket.bucketName;
  }
}
