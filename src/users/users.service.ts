// import { Injectable, Inject } from '@nestjs/common';
// import {
//   DynamoDBDocumentClient,
//   PutCommand,
//   GetCommand,
//   ScanCommand,
//   DeleteCommand,
//   UpdateCommand,
// } from '@aws-sdk/lib-dynamodb';
// import { User } from './user.model';

// @Injectable()
// export class UsersService {
//   constructor(
//     @Inject('DYNAMODB_CLIENT')
//     private readonly dbClient: DynamoDBDocumentClient,
//   ) {}

//   private readonly tableName = process.env.DYNAMO_TABLE_NAME!;

//   async create(user: User) {
//     const newUser = new User(user);
//     await this.dbClient.send(
//       new PutCommand({ TableName: this.tableName, Item: newUser }),
//     );
//     return newUser;
//   }

//   async findAll() {
//     const { Items } = await this.dbClient.send(
//       new ScanCommand({ TableName: this.tableName }),
//     );
//     return Items;
//   }

//   async findOne(email: string) {
//     const { Item } = await this.dbClient.send(
//       new GetCommand({ TableName: this.tableName, Key: { email } }),
//     );
//     return Item;
//   }

//   async update(email: string, userData: Partial<User>) {
//     if (Object.keys(userData).length === 0) {
//       throw new Error('No fields to update');
//     }

//     const updateExpression: string[] = [];
//     const expressionAttributeValues: Record<string, any> = {}; // ✅ Explicitly defining the type

//     for (const [key, value] of Object.entries(userData)) {
//       updateExpression.push(`#${key} = :${key}`);
//       expressionAttributeValues[`:${key}`] = value;
//     }

//     await this.dbClient.send(
//       new UpdateCommand({
//         TableName: this.tableName,
//         Key: { email },
//         UpdateExpression: `SET ${updateExpression.join(', ')}`,
//         ExpressionAttributeNames: Object.fromEntries(
//           Object.keys(userData).map((key) => [`#${key}`, key]),
//         ), // ✅ Handling reserved keywords
//         ExpressionAttributeValues: expressionAttributeValues,
//         ReturnValues: 'ALL_NEW',
//       }),
//     );

//     return { message: 'User updated successfully' };
//   }

//   async remove(email: string) {
//     await this.dbClient.send(
//       new DeleteCommand({ TableName: this.tableName, Key: { email } }),
//     );
//     return { message: 'User deleted successfully' };
//   }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private readonly apiGatewayUrl =
    process.env.API_GATEWAY_URL ||
    'https://your-api-id.execute-api.your-region.amazonaws.com/dev/users'; // Replace with your API Gateway URL

  async create(user: User) {
    try {
      const response = await axios.post(this.apiGatewayUrl, user);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.apiGatewayUrl);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string) {
    try {
      const response = await axios.get(`${this.apiGatewayUrl}?email=${email}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data || 'User not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(email: string, userData: Partial<User>) {
    if (Object.keys(userData).length === 0) {
      throw new HttpException('No fields to update', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.put(this.apiGatewayUrl, {
        ...userData,
        email,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(email: string) {
    try {
      const response = await axios.delete(
        `${this.apiGatewayUrl}?email=${email}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
