import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  sync getToDo(todoId: string, userId: string) {
    const params = {
        TableName: this.todoTable,
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
}
