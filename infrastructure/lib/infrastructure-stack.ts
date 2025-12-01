import * as cdk from "aws-cdk-lib";
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
  }

  public getLayerBucketArn(): string {
    return this.layerBucketArn;
  }
}
