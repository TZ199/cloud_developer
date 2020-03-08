import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly Index = process.env.INDEX_NAME) {}

  async getAllTodos(todos: TodoItem): Promise<TodoItem> {
    await this.docClient.query({
      TableName: this.TodosTable,
      IndexName: this.Index,
      KeyConditionExpression: 'userId = :userId',
      Select: "ALL ATTRIBUTES",
      ScanIndexForward: false
    }).promise()
    return todos
  }

  async createTodoItem(todos: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.TodosTable,
      Item: todos
    }).promise()
    return todos
  }

  async deleteTodoItem(todos: TodoDelete): Promise<TodoDelete> {
    await this.docClient.delete({
      TableName: this.TodosTable,
      Key: todos
    }).promise()
    return undefined
  }

  async updateTodoItem(todos: TodoUpdate): Promise<TodoUpdate> {
    await this.docClient.update({
      TableName: this.TodosTable,
      Key: todos
    }).promise()
    return undefined
  }
}

/** Create Dynamo Db */
function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}