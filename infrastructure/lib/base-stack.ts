import * as cdk from "aws-cdk-lib";

type BaseStackProps = cdk.StackProps & {
  environmentName: string;
};

export class BaseStack extends cdk.Stack {
  private readonly environmentName: string;

  constructor(scope: cdk.App, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    if (!props?.environmentName) {
      throw new Error("environmentName is required in BaseStackProps");
    }

    this.environmentName = props.environmentName;

  }
}
