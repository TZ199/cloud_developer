import 'source-map-support/register'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodoItem } from '../../businessLogic/todos'

const logger = createLogger('createTodo.ts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Going to event: ', event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const user = getUserId(event)
  const newItem = await createTodoItem(newTodo, user)
  
  logger.info('Value of newItem ', newItem)
    
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: {
        ...newItem,
      }
    })
  }
}


