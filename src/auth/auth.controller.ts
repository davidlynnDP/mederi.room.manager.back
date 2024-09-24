import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto';
import { JwtOauthGuard } from './guards/jwt.oauth.guard';
import { GetUser } from './decorators';
import { JwtOAuthUser } from './interfaces';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async registerNewUser(
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.authService.registerUser(createUserDto);
  }

  @Post('login')
  async loginUser(
    @Body() loginUser: LoginUserDto
  ) {
    return await this.authService.loginUser(loginUser);
  }

  @Get('new_token')
  @UseGuards(JwtOauthGuard)
  async checkAuthStatus(
    @GetUser() user: JwtOAuthUser
  ) {
    return await this.authService.generateNewToken(user);
  }
}
