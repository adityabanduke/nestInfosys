import { Injectable, Inject } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DYNAMODB_CLIENT')
    private readonly dbClient: DynamoDBDocumentClient,
  ) {}

  private readonly tableName = process.env.DYNAMO_TABLE_NAME!;

  async create(user: User) {
    const newUser = new User(user);
    await this.dbClient.send(
      new PutCommand({ TableName: this.tableName, Item: newUser }),
    );
    return newUser;
  }

  async findAll() {
    const { Items } = await this.dbClient.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    return Items;
  }

  async findOne(email: string) {
    const { Item } = await this.dbClient.send(
      new GetCommand({ TableName: this.tableName, Key: { email } }),
    );
    return Item;
  }

  async update(email: string, userData: Partial<User>) {
    if (Object.keys(userData).length === 0) {
      throw new Error('No fields to update');
    }

    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {}; // ✅ Explicitly defining the type

    for (const [key, value] of Object.entries(userData)) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }

    await this.dbClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: Object.fromEntries(
          Object.keys(userData).map((key) => [`#${key}`, key]),
        ), // ✅ Handling reserved keywords
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return { message: 'User updated successfully' };
  }

  async remove(email: string) {
    await this.dbClient.send(
      new DeleteCommand({ TableName: this.tableName, Key: { email } }),
    );
    return { message: 'User deleted successfully' };
  }
}
