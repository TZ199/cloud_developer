import 'source-map-support/register'
import * as aws from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
async getToDo(todoId: string, userId: string) => {
    const params = {
        TableName: this.todoTable,
        IndexName: 
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId,
            ':userId': userId,
        },
        ScanIndexForward: false
    };
    const result = await this.docClient.query(params).promise();
    const items = result.Items;
    return items[0];
    }
};

await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()