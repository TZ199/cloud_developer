import 'source-map-support/register'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger('generateUploadUrl.ts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Going to event: ', event)

  const todoId = event.pathParameters.todoId
  const user = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return undefined
}
