import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { envs } from 'src/config';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class JwtOauthGuard extends AuthGuard('jwt') implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,

    private readonly commonService: CommonService
  ) {
    super();
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const authenticationToken = this.extractTokenFromHeader(request);

    try {
      const { user } = await this.verifyToken(authenticationToken);

      if (!user)
        throw new UnauthorizedException(`Token not valid`)

      const reqUser = {
        id: user.id,
      }
      
      request['user'] = reqUser;

    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string) {

    try {
      const payload = await this.jwtService.verifyAsync(
        token, 
        {
          secret: envs.jwtConstantSecret,
        }
      );

      if (!payload.id) {
        throw new BadRequestException('Invalid token payload');
      }

      return {
        user: { 
          id: payload.id 
        }      
      }

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

}