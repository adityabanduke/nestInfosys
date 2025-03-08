import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private readonly apiGatewayUrl =
    process.env.API_GATEWAY_URL ||
    'https://abc.execute-api.ap-south-1.amazonaws.com/dev/users'; // Replace with your API Gateway URL

  async create(user: User) {
    try {
      const response = await axios.post(this.apiGatewayUrl, user);
      return response.data;
    } catch (error) {
      // console.log(error);
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
      console.log('aditya', error);
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
