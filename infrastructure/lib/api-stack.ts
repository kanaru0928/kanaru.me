import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

type Props = cdk.StackProps & {
  environmentName: string;
};

export class APIStack extends cdk.Stack {
  private environmentName: string;

  constructor(scope: cdk.App, id: string, props?: Props) {
    super(scope, id, props);

    this.environmentName = props?.environmentName || "dev";

    this.createArticleTable();
    this.createArticleBucket();
  }

  private createArticleTable() {
    return new dynamodb.TableV2(this, `ArticlesTable-${this.environmentName}`, {
      tableName: `kanaru-me-articles-table-${this.environmentName}`,
      partitionKey: {
        name: "slug",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }

  private createArticleBucket() {
    return new s3.Bucket(this, `ArticleBucket-${this.environmentName}`, {
      bucketName: `${this.account}-kanaru-me-articles-storage-${this.environmentName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}
