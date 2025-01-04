import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const dynamo = DynamoDBDocumentClient.from(dbClient);

export async function incrementPageViews(
  path: string
): Promise<number | undefined> {
  const updateCommand = new UpdateCommand({
    TableName: `kanaru-me-table-page-views-${process.env.ENVIRONMENT}`,
    Key: {
      path,
    },
    UpdateExpression: "ADD #count :inc",
    ExpressionAttributeNames: {
      "#count": "count",
    },
    ExpressionAttributeValues: {
      ":inc": 1,
    },
  });
  await dynamo.send(updateCommand);
  const getCommand = new GetCommand({
    TableName: `kanaru-me-table-page-views-${process.env.ENVIRONMENT}`,
    Key: {
      path,
    },
  });
  const { Item } = await dynamo.send(getCommand);
  return Item?.count;
}
