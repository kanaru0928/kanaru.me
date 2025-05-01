import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export async function incrementPageViews(
  path: string
): Promise<number | undefined> {
  const updateCommand = new UpdateItemCommand({
    TableName: `kanaru-me-table-page-views-${process.env.ENVIRONMENT}`,
    Key: {
      path: { S: path },
    },
    UpdateExpression: "ADD #count :inc",
    ExpressionAttributeNames: {
      "#count": "count",
    },
    ExpressionAttributeValues: {
      ":inc": { N: "1" },
    },
  });
  await dbClient.send(updateCommand);
  const getCommand = new GetItemCommand({
    TableName: `kanaru-me-table-page-views-${process.env.ENVIRONMENT}`,
    Key: {
      path: { S: path },
    },
  });
  const { Item } = await dbClient.send(getCommand);
  return Item?.count.N ? parseInt(Item.count.N) : undefined;
}
