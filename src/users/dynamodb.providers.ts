import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';

export const DYNAMODB_CLIENT = 'DYNAMODB_CLIENT';

export const DynamoDBProvider = {
  provide: DYNAMODB_CLIENT,
  useFactory: () => {
    return new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1', // Change region as needed
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Add your AWS credentials
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  },
};
