import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule, // Import UsersModule
  ],
  providers: [
    {
      provide: 'DYNAMODB_CLIENT',
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: ['DYNAMODB_CLIENT'], // Ensure it's exported
})
export class AppModule {}
