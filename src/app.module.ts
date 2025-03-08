import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule, // ✅ Used for API Gateway calls
    UsersModule, // ✅ Users module handles requests
  ],
})
export class AppModule {}
