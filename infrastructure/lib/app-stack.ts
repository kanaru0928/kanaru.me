import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

type Props = cdk.StackProps;

export class AppStack extends cdk.Stack {
  private lambdaLayerVersion: lambda.LayerVersion;
  private lambdaFunction: lambda.Function;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    this.lambdaLayerVersion = this.createLambdaLayerVersion();
    this.lambdaFunction = this.createLambda();
  }

  private createLambdaLayerVersion() {
    return new lambda.LayerVersion(this, "KanarumeWebLayer", {
      code: lambda.Code.fromAsset("../web/layer", {
        exclude: ["nodejs/!(node_modules)/**", "nodejs/!(node_modules)"],
      }),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      description: "Node modules for kanaru.me web app",
    });
  }

  private createLambda() {
    return new lambda.Function(this, "KanarumeWebFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../web", {
        exclude: ["node_modules"],
      }),
      layers: [this.lambdaLayerVersion],
    });
  }
}
