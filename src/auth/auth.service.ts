import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { JwtOAuthUser, JwtPayload } from './interfaces';
import { envs } from 'src/config';
import { CreateUserDto, LoginUserDto } from 'src/users/dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly commonService: CommonService
  ) { }

  private async signJwt(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {

    try {

      const { id, iat, exp } = this.jwtService.verify(token, {
        secret: envs.jwtConstantSecret,
      });

      const user = await this.usersService.findOneUser({ id });

      return {
        user: user,
        token: await this.signJwt({ id: user.id }),
      }

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }

  }

  async generateNewToken(user: JwtOAuthUser) {

    return {
      user: user,
      token: await this.signJwt({ id: user.id }),
    };
  }

  async registerUser(createUserDto: CreateUserDto) {

    try {
      const user = await this.usersService.createUser(createUserDto);

      if (!user) {
        throw new BadRequestException(`User creation failed`);
      }

      const payload: JwtPayload = { id: user.id };
      const token = this.jwtService.sign(payload);

      return {
        user: user,
        token: token,
      };
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async loginUser(loginUser: LoginUserDto) {

    try {
      const user = await this.usersService.loginUser(loginUser);

      if (!user) {
        throw new BadRequestException(`User login failed`);
      }

      const payload: JwtPayload = { id: user.id };
      const token = await this.signJwt(payload);

      return {
        user: user,
        token: token,
      };
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }


}
