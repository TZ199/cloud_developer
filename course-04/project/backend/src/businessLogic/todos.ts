import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todoAccess = new TodoAccess()
const logger = createLogger('todos.ts')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

/** get all todos filtered according to user ID */
export async function getAllTodos(
  user: string
): Promise<TodoItem[]> {
  logger.info('In function: getAllTodos()')

  return await todoAccess.getAllTodos(user)
}

/** Create todo item function */
export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  user: string
): Promise<TodoItem> {
  logger.info('In function: createTodoItem()')

  const todoUUID = uuid.v4()
  const item = await todoAccess.createTodoItem({
    userId: user,
    todoId: todoUUID,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: await getUploadUrl(todoUUID),
  })
  logger.info('Item value: ', item)
  return item
}

/** update Todo item */
export async function updateTodoItem(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  user: string
): Promise<TodoUpdate> {
  logger.info('In function: updateTodoItem()')

  return await todoAccess.updateTodoItem({
    todoId: todoId,
    userId: user,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
  })
}

export async function deleteTodoItem(
  todoId: string,
  user: string
): Promise<TodoDelete> {
  logger.info('In function: deleteTodoItem()')

  return await todoAccess.deleteTodoItem({
    userId: user,
    todoId: todoId,
  })
}

export async function getUploadUrl(todoId: string) {
  logger.info('Function getUploadUrl')
  
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}