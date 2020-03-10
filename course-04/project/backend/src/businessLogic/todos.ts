import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('todos.ts')

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

  return await todoAccess.createTodoItem({
    userId: user,
    todoId: todoUUID,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
  })
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

