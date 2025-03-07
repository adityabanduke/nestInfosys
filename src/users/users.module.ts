import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DynamoDBProvider, DYNAMODB_CLIENT } from './dynamodb.providers';

@Module({
  providers: [UsersService, DynamoDBProvider],
  controllers: [UsersController],
  exports: [DYNAMODB_CLIENT], // Export the client if used in other modules
})
export class UsersModule {}
