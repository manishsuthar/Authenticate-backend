import { Controller, Post, Body, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.register(userData);
  }

  @Post('signin')
  async signIn(@Body('phoneNumber') phoneNumber: string, @Body('password') password: string): Promise<string> {
    const token = await this.userService.signIn(phoneNumber, password);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return token;
  }
}
